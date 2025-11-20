const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const ACCESS_TTL = process.env.ACCESS_TTL || '15m';
const REFRESH_TTL_DAYS = parseInt(process.env.REFRESH_TTL_DAYS || '30', 10);

function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TTL });
}

function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function generateRefreshToken() {
  return crypto.randomBytes(48).toString('hex');
}

async function hashRefreshToken(rt) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(rt, salt);
}

async function compareRefreshToken(rt, hash) {
  return bcrypt.compare(rt, hash);
}

function refreshExpiryDate() {
  const d = new Date();
  d.setDate(d.getDate() + REFRESH_TTL_DAYS);
  return d;
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  compareRefreshToken,
  refreshExpiryDate,
};
