const Offer = require('../models/Offer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createOffer = catchAsync(async (req, res, next) => {
    const offer = await Offer.create({
        ...req.body,
        createdBy: req.user.id,
        // Require super admin to approve new offers unless auto-approve is configured
        isApproved: req.user.role === 'superadmin' ? true : false 
    });

    res.status(201).json({
        status: 'success',
        data: {
            offer
        }
    });
});

exports.getAllOffers = catchAsync(async (req, res, next) => {
    // Return all offers that are not expired
    const offers = await Offer.find({ 
        expiryDate: { $gte: new Date() }
    });

    res.status(200).json({
        status: 'success',
        results: offers.length,
        data: {
            offers
        }
    });
});

exports.getMyOffers = catchAsync(async (req, res, next) => {
    const offers = await Offer.find({ createdBy: req.user.id });

    res.status(200).json({
        status: 'success',
        results: offers.length,
        data: {
            offers
        }
    });
});

exports.getNearbyOffers = catchAsync(async (req, res, next) => {
    const { lat, lng, distance = 5000 } = req.query; // default distance 5km

    if (!lat || !lng) {
        return next(new AppError('Please provide both latitude and longitude.', 400));
    }

    const offers = await Offer.find({
        expiryDate: { $gte: new Date() },
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(lng), parseFloat(lat)]
                },
                $maxDistance: parseInt(distance)
            }
        }
    });

    res.status(200).json({
        status: 'success',
        results: offers.length,
        data: {
            offers
        }
    });
});

// SUPER ADMIN OR OFFER CREATOR
exports.updateOffer = catchAsync(async (req, res, next) => {
    let offer = await Offer.findById(req.params.id);

    if (!offer) {
        return next(new AppError('No offer found with that ID', 404));
    }

    if (offer.createdBy.toString() !== req.user.id && req.user.role !== 'superadmin') {
         return next(new AppError('You do not have permission to edit this offer', 403));
    }

    offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            offer
        }
    });
});

exports.deleteOffer = catchAsync(async (req, res, next) => {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
        return next(new AppError('No offer found with that ID', 404));
    }

    if (offer.createdBy.toString() !== req.user.id && req.user.role !== 'superadmin') {
         return next(new AppError('You do not have permission to delete this offer', 403));
    }

    await offer.deleteOne();

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// SUPER ADMIN ONLY
exports.approveOffer = catchAsync(async (req, res, next) => {
    const offer = await Offer.findByIdAndUpdate(
        req.params.id,
        { isApproved: true },
        { new: true, runValidators: true }
    );

    if (!offer) {
        return next(new AppError('No offer found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            offer
        }
    });
});
