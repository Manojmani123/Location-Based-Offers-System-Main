const AppError = require('../utils/AppError');

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['superadmin', 'admin', 'customer']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    
    // Additional check for business admin: they must be approved by superadmin
    if (req.user.role === 'admin' && !req.user.isApproved) {
        return next(
            new AppError('Your business account is pending approval by Super Admin', 403)
        );
    }
    
    next();
  };
};
