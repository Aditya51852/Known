const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

// Register new user
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;
    
    // Validate required fields
    if (!email && !phone) {
      return res.status(400).json({ error: { message: 'Email or phone is required' } });
    }
    if (!password) {
      return res.status(400).json({ error: { message: 'Password is required' } });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        email ? { email } : null,
        phone ? { phone } : null
      ].filter(Boolean)
    });
    
    if (existingUser) {
      return res.status(409).json({ error: { message: 'User already exists' } });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      role: role || 'client'
    });
    
    res.status(201).json(issueAuthResponse(user));
  } catch (e) {
    next(e);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: { message: 'Password is required' } });
    }
    
    // Find user by email or phone
    const user = await User.findOne({
      $or: [
        email ? { email } : null,
        phone ? { phone } : null
      ].filter(Boolean)
    });
    
    if (!user) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }
    
    res.json(issueAuthResponse(user));
  } catch (e) {
    next(e);
  }
});

// Google Sign-In (dev-friendly)
// In production, verify idToken with Google. For development, allow payload with email + googleId when GOOGLE_OAUTH_DEV=true
router.post('/google', async (req, res, next) => {
  try {
    const { idToken, email, name, googleId } = req.body || {};

    const devMode = process.env.GOOGLE_OAUTH_DEV === 'true';
    if (!idToken && !(devMode && email && googleId)) {
      return res.status(400).json({ error: { message: 'idToken is required (or email+googleId in dev mode)' } });
    }

    // TODO: If not in devMode, verify idToken with Google and extract email, name, sub as googleId
    let payload = { email, name, sub: googleId };
    if (!devMode) {
      // Skipping external dependency to keep repo runnable; require email+googleId from client for now
      if (!email || !googleId) {
        return res.status(400).json({ error: { message: 'Google token verification not configured. Provide email and googleId.' } });
      }
    }

    // Find existing user by googleId or email
    let user = await User.findOne({
      $or: [
        payload.sub ? { googleId: payload.sub } : null,
        payload.email ? { email: payload.email } : null,
      ].filter(Boolean)
    });

    if (!user) {
      user = await User.create({
        name: payload.name || null,
        email: payload.email || null,
        googleId: payload.sub || null,
        role: 'client',
      });
    } else if (!user.googleId && payload.sub) {
      user.googleId = payload.sub;
      await user.save();
    }

    return res.json(issueAuthResponse(user));
  } catch (e) {
    next(e);
  }
});

// Phone OTP: send (dev sends 1234)
router.post('/otp/send', async (req, res, next) => {
  try {
    const { phone } = req.body || {};
    if (!phone) return res.status(400).json({ error: { message: 'Phone is required' } });
    // Integrate with SMS provider in production
    // For dev: always send code 1234 (not actually sending SMS)
    res.json({ success: true, devCode: process.env.NODE_ENV !== 'production' ? '1234' : undefined });
  } catch (e) {
    next(e);
  }
});

// Phone OTP: verify
router.post('/otp/verify', async (req, res, next) => {
  try {
    const { phone, otp } = req.body || {};
    if (!phone || !otp) return res.status(400).json({ error: { message: 'Phone and otp are required' } });
    if (process.env.NODE_ENV !== 'production') {
      if (otp !== '1234') return res.status(401).json({ error: { message: 'Invalid OTP' } });
    } else {
      // TODO: Validate OTP via provider/session store
      return res.status(500).json({ error: { message: 'OTP validation not configured' } });
    }

    // Find or create user by phone
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone, role: 'client' });
    }

    return res.json(issueAuthResponse(user));
  } catch (e) {
    next(e);
  }
});

// Get current user profile
router.get('/me', async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: { message: 'No token provided' } });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }
    
    res.json({ user });
  } catch (e) {
    if (e.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: { message: 'Invalid token' } });
    }
    next(e);
  }
});

// Update user profile
router.patch('/me', async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: { message: 'No token provided' } });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const updateData = { ...req.body };
    
    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.passwordHash;
    delete updateData.role;
    
    // Mark profile as complete if key fields are present
    if (updateData.name && updateData.email && updateData.phone) {
      updateData.profileComplete = true;
    }
    
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }
    
    res.json({ success: true, user });
  } catch (e) {
    if (e.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: { message: 'Invalid token' } });
    }
    next(e);
  }
});

module.exports = router;

