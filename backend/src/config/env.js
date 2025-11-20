const dotenv = require('dotenv');

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_DB: process.env.MONGODB_DB || 'known',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
};

module.exports = config;
