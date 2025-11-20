const express = require('express');
const bcrypt = require('bcryptjs');
const { ERR } = require('../../utils/errors');
const Dealer = require('../../models/Dealer');
const DealerSession = require('../../models/DealerSession');
const { signAccessToken, generateRefreshToken, hashRefreshToken, compareRefreshToken, refreshExpiryDate } = require('../../utils/tokens');

const router = express.Router();

function dealerPayload(d) {
  return { id: d._id, email: d.email, name: d.name };
}

async function issueTokens(dealer, req) {
  const accessToken = signAccessToken({ dealerId: String(dealer._id), role: 'dealer' });
  const rt = generateRefreshToken();
  const tokenHash = await hashRefreshToken(rt);
  const session = await DealerSession.create({
    dealerId: dealer._id,
    tokenHash,
    userAgent: req.get('user-agent') || null,
    ip: req.ip,
    expiresAt: refreshExpiryDate(),
  });
  return { accessToken, refreshToken: rt, sessionId: session._id };
}

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name, phone } = req.body || {};
    if (!email || !password || !name) throw ERR.MISSING_FIELDS('name, email, password are required');
    const exists = await Dealer.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(409).json({ error: 'VALIDATION_ERROR', message: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const dealer = await Dealer.create({ email: email.toLowerCase().trim(), passwordHash, name, phone, roles: ['dealer'] });
    const tokens = await issueTokens(dealer, req);
    return res.status(201).json({ token: tokens.accessToken, refreshToken: tokens.refreshToken, dealer: dealerPayload(dealer) });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) throw ERR.MISSING_FIELDS('email and password are required');
    const dealer = await Dealer.findOne({ email: email.toLowerCase().trim() });
    if (!dealer) return res.status(404).json({ error: 'USER_NOT_FOUND', message: 'No dealer registered with this email' });
    const ok = await bcrypt.compare(password, dealer.passwordHash || '');
    if (!ok) return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Password incorrect' });
    const tokens = await issueTokens(dealer, req);
    return res.json({ token: tokens.accessToken, refreshToken: tokens.refreshToken, dealer: dealerPayload(dealer) });
  } catch (e) { next(e); }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body || {};
    if (!refreshToken) throw ERR.MISSING_FIELDS('refreshToken is required');
    const sessions = await DealerSession.find({ revoked: false, expiresAt: { $gt: new Date() } });
    let matched = null;
    for (const s of sessions) {
      if (await compareRefreshToken(refreshToken, s.tokenHash)) { matched = s; break; }
    }
    if (!matched) return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Invalid refresh token' });
    matched.revoked = true;
    await matched.save();
    const dealer = await Dealer.findById(matched.dealerId);
    if (!dealer) return res.status(404).json({ error: 'USER_NOT_FOUND', message: 'Dealer not found' });
    const accessToken = signAccessToken({ dealerId: String(dealer._id), role: 'dealer' });
    const newRt = generateRefreshToken();
    const tokenHash = await hashRefreshToken(newRt);
    await DealerSession.create({ dealerId: dealer._id, tokenHash, userAgent: req.get('user-agent') || null, ip: req.ip, expiresAt: refreshExpiryDate(), rotatedFrom: matched._id });
    return res.json({ token: accessToken, refreshToken: newRt, dealer: dealerPayload(dealer) });
  } catch (e) { next(e); }
});

router.post('/logout', async (req, res, next) => {
  try {
    const { refreshToken } = req.body || {};
    if (!refreshToken) return res.json({ success: true });
    const sessions = await DealerSession.find({ revoked: false });
    for (const s of sessions) {
      if (await compareRefreshToken(refreshToken, s.tokenHash)) {
        s.revoked = true; await s.save(); break;
      }
    }
    return res.json({ success: true });
  } catch (e) { next(e); }
});

module.exports = router;
