const AppError = require('../utils/AppError');

const validateReq = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e) {
      // Return 400 Bad Request if validation fails
      const errorMessage = e.errors ? e.errors.map(err => err.message).join(', ') : 'Validation Error';
      return next(new AppError(errorMessage, 400));
    }
  };
};

module.exports = validateReq;
