const app = require('./app');
const { connectDB } = require('./config/db');
const { PORT, MONGODB_URI } = require('./config/env');

(async () => {
  try {
    await connectDB(MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`Structured server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
