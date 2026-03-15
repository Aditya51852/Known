const jwt = require('jsonwebtoken');
const { ERR } = require('../utils/errors');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Middleware: attach req.user = { id, role } from JWT.
 * Works for ANY authenticated user (client, mentor, service_provider, admin).
 */
function requireAuth(req, res, next) {
  try {
    const auth = req.header('Authorization');
    if (!auth) throw ERR.NOT_AUTHENTICATED('Missing Authorization header');
    const token = auth.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.userId) throw ERR.NOT_AUTHENTICATED('Invalid token payload');
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch (e) {
    const status = e.status || (e.name === 'JsonWebTokenError' ? 401 : 500);
    return res.status(status).json({
      error: { code: e.code || 'NOT_AUTHENTICATED', message: e.message || 'Unauthorized' },
    });
  }
}

/**
 * Middleware factory: restrict to specific roles.
 * Usage: requireRole('client', 'admin')
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: { code: 'NOT_AUTHENTICATED', message: 'Not authenticated' } });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: `Requires role: ${roles.join(' or ')}` } });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
