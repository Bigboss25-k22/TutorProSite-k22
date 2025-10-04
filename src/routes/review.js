const express = require('express');
const router = express.Router();

const reviewController = require('../app/controllers/ReviewController');
const { authenticateToken, authorizeRoles } = require('../app/middleware/authmiddleware');

// Route lấy danh sách gia sư

router.get('/:slug', authenticateToken, authorizeRoles('parent'), reviewController.showReviewForm);
router.post('/:slug', authenticateToken, authorizeRoles('parent'), reviewController.submitReview);
router.get('/:slug/list', authenticateToken, authorizeRoles('parent'), reviewController.getReviews);




module.exports = router;
