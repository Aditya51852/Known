const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Middleware to verify JWT token and protect routes
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: { message: 'Authentication required. No token provided.' } 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user and attach to request
    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ 
        error: { message: 'User associated with this token not found' } 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: { message: 'Invalid or expired token' } 
      });
    }
    console.error('Auth Middleware Error:', error);
    return res.status(500).json({ 
      error: { message: 'Internal server error during authentication' } 
    });
  }
};

/**
 * Middleware to restrict access based on user role
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: { message: `Role '${req.user ? req.user.role : 'Unknown'}' is not authorized to access this route` } 
      });
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
