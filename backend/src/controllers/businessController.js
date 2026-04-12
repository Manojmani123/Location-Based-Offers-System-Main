const Business = require('../models/Business');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createBusinessProfile = catchAsync(async (req, res, next) => {
    // Check if user already has a business
    const existingBusiness = await Business.findOne({ ownerId: req.user.id });
    if (existingBusiness) {
        return next(new AppError('User already has a registered business', 400));
    }

    const business = await Business.create({
        ownerId: req.user.id,
        businessName: req.body.businessName,
        documents: req.body.documents,
        category: req.body.category
    });

    res.status(201).json({
        status: 'success',
        data: {
            business
        }
    });
});

exports.getBusinessProfile = catchAsync(async (req, res, next) => {
    const business = await Business.findOne({ ownerId: req.user.id });

    if (!business) {
        return next(new AppError('No business profile found for this user', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            business
        }
    });
});

// SUPER ADMIN ONLY
exports.getPendingBusinesses = catchAsync(async (req, res, next) => {
    const businesses = await Business.find({ isVerified: false }).populate('ownerId', 'name email');

    res.status(200).json({
        status: 'success',
        results: businesses.length,
        data: {
            businesses
        }
    });
});

// SUPER ADMIN ONLY
exports.approveBusiness = catchAsync(async (req, res, next) => {
    const business = await Business.findByIdAndUpdate(
        req.params.id,
        { isVerified: true },
        { new: true, runValidators: true }
    );

    if (!business) {
        return next(new AppError('No business found with that ID', 404));
    }

    // Also update the user's isApproved status
    await User.findByIdAndUpdate(business.ownerId, { isApproved: true });

    res.status(200).json({
        status: 'success',
        data: {
            business
        }
    });
});
