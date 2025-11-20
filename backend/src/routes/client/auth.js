const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper to issue JWT and return user payload
const issueAuthResponse = (user) => {
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  return {
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileComplete: !!user.profileComplete,
    }
  };
};

// Register new user (client/service/mentor)
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!email && !phone) {
      return res.status(400).json({ error: { message: 'Email or phone is required' } });
    }
    if (!password) {
      return res.status(400).json({ error: { message: 'Password is required' } });
    }
    const existingUser = await User.findOne({
      $or: [
        email ? { email } : null,
        phone ? { phone } : null
      ].filter(Boolean)
    });
    if (existingUser) {
      return res.status(409).json({ error: { message: 'User already exists' } });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      role: role || 'client'
    });
    res.status(201).json(issueAuthResponse(user));
  } catch (e) { next(e); }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;
    if (!password) {
      return res.status(400).json({ error: { message: 'Password is required' } });
    }
    const user = await User.findOne({
      $or: [
        email ? { email } : null,
        phone ? { phone } : null
      ].filter(Boolean)
    });
    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }
    const ok = await bcrypt.compare(password, user.passwordHash || '');
    if (!ok) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }
    res.json(issueAuthResponse(user));
  } catch (e) { next(e); }
});

// Google sign-in (dev-friendly)
router.post('/google', async (req, res, next) => {
  try {
    const devEnabled = String(process.env.GOOGLE_OAUTH_DEV || '').toLowerCase() === 'true';
    const { idToken, email, googleId, name, role } = req.body || {};
    if (!devEnabled && !idToken) {
      return res.status(400).json({ error: { message: 'Google OAuth not configured' } });
    }
    if (!email && !googleId && !idToken) {
      return res.status(400).json({ error: { message: 'Missing google credentials' } });
    }
    let user = await User.findOne({
      $or: [
        email ? { email } : null,
        googleId ? { googleId } : null,
      ].filter(Boolean)
    });
    if (!user) {
      user = await User.create({ email, googleId, name, role: role || 'client' });
    } else {
      let changed = false;
      if (googleId && !user.googleId) { user.googleId = googleId; changed = true; }
      if (name && !user.name) { user.name = name; changed = true; }
      if (changed) { await user.save(); }
    }
    return res.json(issueAuthResponse(user));
  } catch (e) { next(e); }
});

// Login with OTP (simplified stub aligning to existing API)
router.post('/login/otp', async (req, res, next) => {
  try {
    const { phone, role: incomingRole } = req.body || {};
    if (!phone) {
      return res.status(400).json({ error: { message: 'Phone is required' } });
    }
    const allowedRoles = ['client','dealer','mentor','service_provider','admin'];
    const normalizedRole = allowedRoles.includes(incomingRole) ? incomingRole : 'client';
    let user = await User.findOne({ phone });
    if (!user) { user = await User.create({ phone, role: normalizedRole }); }
    else if (incomingRole && user.role !== normalizedRole) { user.role = normalizedRole; await user.save(); }
    return res.json(issueAuthResponse(user));
  } catch (e) { next(e); }
});

// Send OTP (dev no-op)
router.post('/otp/send', async (req, res, next) => {
  try {
    const { phone } = req.body || {};
    if (!phone) { return res.status(400).json({ error: { message: 'Phone is required' } }); }
    return res.json({ success: true });
  } catch (e) { next(e); }
});

// Verify OTP (dev accepts any otp)
router.post('/otp/verify', async (req, res, next) => {
  try {
    const { phone, otp, role: incomingRole } = req.body || {};
    if (!phone || !otp) { return res.status(400).json({ error: { message: 'Phone and otp are required' } }); }
    const allowedRoles = ['client','dealer','mentor','service_provider','admin'];
    const normalizedRole = allowedRoles.includes(incomingRole) ? incomingRole : 'client';
    let user = await User.findOne({ phone });
    if (!user) { user = await User.create({ phone, role: normalizedRole }); }
    else if (incomingRole && user.role !== normalizedRole) { user.role = normalizedRole; await user.save(); }
    return res.json(issueAuthResponse(user));
  } catch (e) { next(e); }
});

// Get/Update profile
router.get('/me', async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) { return res.status(401).json({ error: { message: 'No token provided' } }); }
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) { return res.status(404).json({ error: { message: 'User not found' } }); }
    res.json({ user });
  } catch (e) {
    if (e.name === 'JsonWebTokenError') { return res.status(401).json({ error: { message: 'Invalid token' } }); }
    next(e);
  }
});

router.patch('/me', async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) { return res.status(401).json({ error: { message: 'No token provided' } }); }
    const decoded = jwt.verify(token, JWT_SECRET);
    const updateData = { ...req.body };
    delete updateData.passwordHash; delete updateData.role;
    if (updateData.name && updateData.email && updateData.phone) { updateData.profileComplete = true; }
    const user = await User.findByIdAndUpdate(decoded.userId, updateData, { new: true, runValidators: true }).select('-passwordHash');
    if (!user) { return res.status(404).json({ error: { message: 'User not found' } }); }
    res.json({ success: true, user });
  } catch (e) {
    if (e.name === 'JsonWebTokenError') { return res.status(401).json({ error: { message: 'Invalid token' } }); }
    next(e);
  }
});

module.exports = router;
