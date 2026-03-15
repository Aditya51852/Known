const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Define Auth Routes
router.post('/google', authController.googleLogin);

// You can add other routes here like:
// router.post('/login', authController.login);
// router.post('/register', authController.register);

module.exports = router;
