const { Sequelize } = require('sequelize');

const DB_DIALECT = process.env.SQL_DIALECT || 'postgres';
const DB_HOST = process.env.SQL_HOST || 'localhost';
const DB_PORT = process.env.SQL_PORT || 5432;
const DB_NAME = process.env.SQL_DB || 'known_cars';
const DB_USER = process.env.SQL_USER || 'postgres';
const DB_PASS = process.env.SQL_PASS || 'postgres';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: +DB_PORT,
  dialect: DB_DIALECT,
  logging: process.env.NODE_ENV === 'production' ? false : console.log,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

async function connectSQL() {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully.');
    // Sync all models (creates tables if they don't exist)
    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
    console.log('SQL tables synced.');
  } catch (error) {
    console.error('PostgreSQL connection failed:', error.message);
    throw error;
  }
}

function sqlHealth() {
  return sequelize.connectionManager.pool ? 'ok' : 'degraded';
}

module.exports = { sequelize, connectSQL, sqlHealth };
