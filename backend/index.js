const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();
const { connectDB, mongoHealth } = require('./db');
const carsRouter = require('./routes/cars');
const testdriveRouter = require('./routes/testdrive');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(helmet());
const corsOptions =
  CORS_ORIGIN === '*'
    ? { origin: '*', credentials: false }
    : { origin: CORS_ORIGIN.split(',').map((s) => s.trim()), credentials: true };
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/cars', carsRouter);
app.use('/api/testdrive', testdriveRouter);
app.use('/api/auth', authRouter);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    db: mongoHealth(),
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.send('server is running!');
});

app.use((req, res, next) => {
  res.status(404).json({ error: { message: 'Not Found', code: 'NOT_FOUND' } });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || 'Internal Server Error',
      code: err.code || 'INTERNAL_SERVER_ERROR',
    },
  });
});

;(async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();