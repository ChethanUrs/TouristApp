const express = require('express');
const {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
  getFeaturedDestinations,
  createDestinationReview,
  fetchDestinationAI,
} = require('../controllers/destinationController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getDestinations).post(protect, admin, createDestination);
router.post('/ai-fetch', protect, admin, fetchDestinationAI);
router.get('/featured', getFeaturedDestinations);
router
  .route('/:id')
  .get(getDestinationById)
  .put(protect, admin, updateDestination)
  .delete(protect, admin, deleteDestination);
router.route('/:id/reviews').post(protect, createDestinationReview);

module.exports = router;
