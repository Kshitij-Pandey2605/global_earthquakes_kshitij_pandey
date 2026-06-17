const express = require('express');
const router = express.Router();
const jwtController = require('../controllers/jwt.controller');
const { protect } = require('../middleware/auth.middleware');

// Protect all routes in this router
router.use(protect);

router.get('/profile', jwtController.getProfile);
router.get('/dashboard', jwtController.getDashboard);
router.get('/private-earthquakes', jwtController.getPrivateEarthquakes);
router.get('/private-analytics', jwtController.getPrivateAnalytics);

module.exports = router;
