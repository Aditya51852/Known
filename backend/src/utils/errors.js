function err(code, message, status = 400, details = {}) {
  const e = new Error(message || code);
  e.code = code;
  e.status = status;
  e.details = details;
  return e;
}

const ERR = {
  USER_NOT_FOUND: (msg = 'User not found') => err('USER_NOT_FOUND', msg, 404),
  INVALID_CREDENTIALS: (msg = 'Invalid credentials') => err('INVALID_CREDENTIALS', msg, 401),
  MISSING_FIELDS: (msg = 'Missing required fields') => err('MISSING_FIELDS', msg, 400),
  VALIDATION_ERROR: (msg = 'Validation error', details={}) => err('VALIDATION_ERROR', msg, 422, details),
  FORBIDDEN: (msg = 'Forbidden') => err('FORBIDDEN', msg, 403),
  NOT_OWNER: (msg = 'Not the owner') => err('NOT_OWNER', msg, 403),
  NOT_AUTHENTICATED: (msg = 'Not authenticated') => err('NOT_AUTHENTICATED', msg, 401),
  INTERNAL_ERROR: (msg = 'Internal error') => err('INTERNAL_ERROR', msg, 500),
};

module.exports = { err, ERR };
