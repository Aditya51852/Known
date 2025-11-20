const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { mongoHealth } = require('./config/db');
const apiRouter = require('./routes/index');
const { CORS_ORIGIN } = require('./config/env');

const app = express();

const corsOptions =
  CORS_ORIGIN === '*'
    ? { origin: '*', credentials: false }
    : { origin: CORS_ORIGIN.split(',').map((s) => s.trim()), credentials: true };

app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

app.use('/api', apiRouter);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    db: mongoHealth(),
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.send('structured server is running!');
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

module.exports = app;
