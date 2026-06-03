const mongoose = require('mongoose');
const Earthquake = require('../models/earthquake.model');
const AppError = require('../utils/AppError');

/**
 * @desc      Create a new earthquake record
 * @route     POST /api/v1/earthquakes
 * @access    Public
 */
const createEarthquake = async (req, res, next) => {
  try {
    const newEarthquake = await Earthquake.create(req.body);
    return res.status(201).json({
      status: 'success',
      data: {
        earthquake: newEarthquake
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc      Get all earthquake records with optional limit
 * @route     GET /api/v1/earthquakes
 * @access    Public
 */
const getEarthquakes = async (req, res, next) => {
  try {
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
    next(error);
  }
};

/**
 * @desc      Get a single earthquake by MongoDB ObjectId or custom eventId
 * @route     GET /api/v1/earthquakes/:id
 * @access    Public
 */
const getEarthquakeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let earthquake;

    if (mongoose.Types.ObjectId.isValid(id)) {
      earthquake = await Earthquake.findById(id);
    } else {
      earthquake = await Earthquake.findOne({ eventId: id });
    }

    if (!earthquake) {
      return next(new AppError(`No earthquake found with identifier: ${id}`, 404));
    }

    return res.status(200).json({
      status: 'success',
      data: { earthquake }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc      Partially update an earthquake record
 * @route     PATCH /api/v1/earthquakes/:id
 * @access    Public
 */
const updateEarthquake = async (req, res, next) => {
  try {
    const { id } = req.params;
    let earthquake;

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
      return next(new AppError(`No earthquake found with identifier: ${id}`, 404));
    }

    return res.status(200).json({
      status: 'success',
      data: { earthquake }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc      Delete an earthquake record
 * @route     DELETE /api/v1/earthquakes/:id
 * @access    Public
 */
const deleteEarthquake = async (req, res, next) => {
  try {
    const { id } = req.params;
    let earthquake;

    if (mongoose.Types.ObjectId.isValid(id)) {
      earthquake = await Earthquake.findByIdAndDelete(id);
    } else {
      earthquake = await Earthquake.findOneAndDelete({ eventId: id });
    }

    if (!earthquake) {
      return next(new AppError(`No earthquake found with identifier: ${id}`, 404));
    }

    return res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEarthquake,
  getEarthquakes,
  getEarthquakeById,
  updateEarthquake,
  deleteEarthquake
};
