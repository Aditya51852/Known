const path = require('path');
const express = require('express');
const router = express.Router();

const carsRouter = require('./cars');
const testdriveRouter = require('./testdrive');
const clientAuthRouter = require('./client/auth');
const dealerAuthRouter = require('./dealer/auth');
const dealersRouter = require('./dealer/dealers');

router.use('/cars', carsRouter);
router.use('/testdrive', testdriveRouter);
router.use('/auth', clientAuthRouter);
router.use('/auth/dealer', dealerAuthRouter);
router.use('/dealers', dealersRouter);

module.exports = router;
