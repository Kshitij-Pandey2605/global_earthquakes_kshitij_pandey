const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/responseFormatter');

/**
 * @desc      Get logged-in user profile under JWT namespace
 * @route     GET /api/v1/jwt/profile
 * @access    Private (Protected)
 */
const getProfile = asyncHandler(async (req, res, next) => {
  sendSuccess(res, { user: req.user }, 'Profile retrieved successfully.');
});

/**
 * @desc      Get secure dashboard metrics
 * @route     GET /api/v1/jwt/dashboard
 * @access    Private (Protected)
 */
const getDashboard = asyncHandler(async (req, res, next) => {
  sendSuccess(
    res,
    {
      message: 'Welcome to the secure dashboard! Access granted to authenticated user.',
      session: {
        userId: req.user._id,
        role: req.user.role,
        email: req.user.email
      }
    },
    'Dashboard details accessed successfully.'
  );
});

/**
 * @desc      Get restricted private earthquake datasets
 * @route     GET /api/v1/jwt/private-earthquakes
 * @access    Private (Protected)
 */
const getPrivateEarthquakes = asyncHandler(async (req, res, next) => {
  sendSuccess(
    res,
    {
      message: 'Access granted to private earthquake logs. You are viewing restricted database segments.'
    },
    'Private earthquake data accessed.'
  );
});

/**
 * @desc      Get restricted private analytics aggregations
 * @route     GET /api/v1/jwt/private-analytics
 * @access    Private (Protected)
 */
const getPrivateAnalytics = asyncHandler(async (req, res, next) => {
  sendSuccess(
    res,
    {
      message: 'Access granted to secure aggregations. You are viewing restricted analytical reports.'
    },
    'Private analytics accessed.'
  );
});

module.exports = {
  getProfile,
  getDashboard,
  getPrivateEarthquakes,
  getPrivateAnalytics
};
