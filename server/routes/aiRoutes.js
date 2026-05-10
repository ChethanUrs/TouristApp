const express = require('express');
const router = express.Router();
const { generateInsights, chatWithAI, searchPlaceAI } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/insights', protect, generateInsights);
router.post('/chat', protect, chatWithAI);
router.post('/search-place', protect, searchPlaceAI);

module.exports = router;
