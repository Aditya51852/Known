const mongoose = require('mongoose');

let isConnected = false;

async function connectDB(uri) {
  if (!uri) throw new Error('MONGODB_URI is not set');
  if (isConnected) return;
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || 'known' });
  isConnected = true;
  mongoose.connection.on('disconnected', () => {
    isConnected = false;
  });
}

function mongoHealth() {
  return mongoose.connection.readyState === 1 ? 'ok' : 'degraded';
}

async function closeDB() {
  await mongoose.connection.close();
  isConnected = false;
}

module.exports = { connectDB, closeDB, mongoHealth };
