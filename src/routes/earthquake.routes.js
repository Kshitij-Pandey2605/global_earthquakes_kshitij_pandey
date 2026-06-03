const express = require('express');
const router = express.Router();
const earthquakeController = require('../controllers/earthquake.controller');

// GET /api/v1/earthquakes & POST /api/v1/earthquakes
router.route('/')
  .get(earthquakeController.getEarthquakes)
  .post(earthquakeController.createEarthquake);

// GET, PATCH, DELETE /api/v1/earthquakes/:id
router.route('/:id')
  .get(earthquakeController.getEarthquakeById)
  .patch(earthquakeController.updateEarthquake)
  .delete(earthquakeController.deleteEarthquake);

module.exports = router;
