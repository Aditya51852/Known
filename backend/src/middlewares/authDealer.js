const jwt = require('jsonwebtoken');
const { ERR } = require('../utils/errors');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function requireDealer(req, res, next) {
  try {
    const auth = req.header('Authorization');
    if (!auth) throw ERR.NOT_AUTHENTICATED('Missing Authorization header');
    const token = auth.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || decoded.role !== 'dealer') throw ERR.FORBIDDEN('Dealer token required');
    req.dealer = { id: decoded.userId || decoded.dealerId, role: decoded.role };
    next();
  } catch (e) {
    const status = e.status || (e.name === 'JsonWebTokenError' ? 401 : 500);
    return res.status(status).json({ error: { error: e.code || 'NOT_AUTHENTICATED', message: e.message || 'Unauthorized', details: e.details || {} } });
  }
}

function requireOwnerParam(paramName = 'id') {
  return (req, res, next) => {
    if (!req.dealer) return res.status(401).json({ error: { error: 'NOT_AUTHENTICATED', message: 'Not authenticated' } });
    if (String(req.dealer.id) !== String(req.params[paramName])) {
      return res.status(403).json({ error: { error: 'FORBIDDEN', message: 'Owner token mismatch' } });
    }
    next();
  };
}

module.exports = { requireDealer, requireOwnerParam };
