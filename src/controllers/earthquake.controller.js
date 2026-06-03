const mongoose = require('mongoose');
const Earthquake = require('../models/earthquake.model');

/**
 * @desc      Create a new earthquake record
 * @route     POST /api/v1/earthquakes
 * @access    Public
 */
const createEarthquake = async (req, res) => {
  try {
    const newEarthquake = await Earthquake.create(req.body);
    return res.status(201).json({
      status: 'success',
      data: {
        earthquake: newEarthquake
      }
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

/**
 * @desc      Get all earthquake records (limited baseline list)
 * @route     GET /api/v1/earthquakes
 * @access    Public
 */
const getEarthquakes = async (req, res) => {
  try {
    // Basic limit of 100 records to prevent heap exhaustion before pagination is built in PR-12
    const limit = parseInt(req.query.limit, 10) || 100;
    const earthquakes = await Earthquake.find().sort({ time: -1 }).limit(limit);

    return res.status(200).json({
      status: 'success',
      results: earthquakes.length,
      data: {
        earthquakes
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * @desc      Get a single earthquake record by Mongoose ID or eventId
 * @route     GET /api/v1/earthquakes/:id
 * @access    Public
 */
const getEarthquakeById = async (req, res) => {
  try {
    const { id } = req.params;
    let earthquake;

    // Check if ID is a valid MongoDB ObjectId; if not, query by custom eventId
    if (mongoose.Types.ObjectId.isValid(id)) {
      earthquake = await Earthquake.findById(id);
    } else {
      earthquake = await Earthquake.findOne({ eventId: id });
    }

    if (!earthquake) {
      return res.status(404).json({
        status: 'fail',
        message: `No earthquake found with identifier: ${id}`
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        earthquake
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * @desc      Update an earthquake record (Full/Partial)
 * @route     PATCH /api/v1/earthquakes/:id
 * @access    Public
 */
const updateEarthquake = async (req, res) => {
  try {
    const { id } = req.params;
    let earthquake;

    // Resolve query by ObjectId or eventId
    if (mongoose.Types.ObjectId.isValid(id)) {
      earthquake = await Earthquake.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      });
    } else {
      earthquake = await Earthquake.findOneAndUpdate({ eventId: id }, req.body, {
        new: true,
        runValidators: true
      });
    }

    if (!earthquake) {
      return res.status(404).json({
        status: 'fail',
        message: `No earthquake found with identifier: ${id}`
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        earthquake
      }
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

/**
 * @desc      Delete an earthquake record
 * @route     DELETE /api/v1/earthquakes/:id
 * @access    Public
 */
const deleteEarthquake = async (req, res) => {
  try {
    const { id } = req.params;
    let earthquake;

    if (mongoose.Types.ObjectId.isValid(id)) {
      earthquake = await Earthquake.findByIdAndDelete(id);
    } else {
      earthquake = await Earthquake.findOneAndDelete({ eventId: id });
    }

    if (!earthquake) {
      return res.status(404).json({
        status: 'fail',
        message: `No earthquake found with identifier: ${id}`
      });
    }

    // Standard REST DELETE response returns 204 No Content
    return res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  createEarthquake,
  getEarthquakes,
  getEarthquakeById,
  updateEarthquake,
  deleteEarthquake
};
