const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Business = require('../models/Business');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        location: user.location
      }
    }
  });
};

exports.register = catchAsync(async (req, res, next) => {
  // If no role is specified, it defaults to 'customer' in the schema
  // But we shouldn't allow someone to pass 'superadmin' without authorization
  let role = req.body.role;
  if (role === 'superadmin') {
     role = 'customer'; // prevent direct superadmin creation via public endpoint
  }

  // Ensure location is always a valid GeoJSON Point with coordinates
  let location = req.body.location;
  if (!location || !location.coordinates || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
    location = { type: 'Point', coordinates: [0, 0] };
  }

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: role,
    location
  });

  if (role === 'admin') {
    await Business.create({
      ownerId: newUser._id,
      businessName: req.body.businessName || newUser.name,
      documents: req.body.documents || ['placeholder.pdf'],
      category: req.body.category || 'Other'
    });
  }

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists & password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.getMe = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: {
            user: req.user
        }
    });
});
