const path = require('path');
const express = require('express');
const router = express.Router();

const carsRouter = require('./cars');
const testdriveRouter = require('./testdrive');
const clientAuthRouter = require('./client/auth');
const dealerAuthRouter = require('./dealer/auth');
const dealersRouter = require('./dealer/dealers');
const bargainRouter = require('./bargain');
const mentorsRouter = require('./mentors');
const notificationsRouter = require('./notifications');
const wishlistRouter = require('./wishlist');
const adminRouter = require('./admin');
const reviewsRouter = require('./reviews');

router.use('/cars', carsRouter);
router.use('/testdrive', testdriveRouter);
router.use('/auth', clientAuthRouter);
router.use('/auth/dealer', dealerAuthRouter);
router.use('/dealers', dealersRouter);
router.use('/bargain', bargainRouter);
router.use('/mentors', mentorsRouter);
router.use('/notifications', notificationsRouter);
router.use('/wishlist', wishlistRouter);
router.use('/admin', adminRouter);
router.use('/reviews', reviewsRouter);

module.exports = router;
