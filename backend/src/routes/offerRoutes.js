const express = require('express');
const offerController = require('../controllers/offerController');
const { protect } = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/rbac');

const router = express.Router();

// Public routes (though might require auth in real system depending on rules)
router.get('/', offerController.getAllOffers);
router.get('/nearby', offerController.getNearbyOffers);

// Protected routes
router.use(protect);

router.get('/me', offerController.getMyOffers);

router.post(
  '/',
  restrictTo('admin', 'superadmin'), // Requires approved admin (handled in rbac)
  offerController.createOffer
);

router.patch(
  '/:id',
  restrictTo('admin', 'superadmin'),
  offerController.updateOffer
);

router.delete(
  '/:id',
  restrictTo('admin', 'superadmin'),
  offerController.deleteOffer
);

// Super Admin approval route
router.patch(
  '/:id/approve',
  restrictTo('superadmin'),
  offerController.approveOffer
);

module.exports = router;
