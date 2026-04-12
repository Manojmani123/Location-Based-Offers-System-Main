const express = require('express');
const businessController = require('../controllers/businessController');
const { protect } = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/rbac');

const router = express.Router();

// Require auth for all routes
router.use(protect);

router.post(
  '/',
  restrictTo('admin', 'superadmin'),
  businessController.createBusinessProfile
);

router.get(
  '/me',
  restrictTo('admin', 'superadmin'),
  businessController.getBusinessProfile
);

// Super Admin Routes
router.use(restrictTo('superadmin'));

router.get('/pending', businessController.getPendingBusinesses);
router.patch('/:id/approve', businessController.approveBusiness);

module.exports = router;
