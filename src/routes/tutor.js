const express = require('express');
const router = express.Router();

const tutorController = require('../app/controllers/TutorController'); // Đảm bảo đường dẫn đúng
const { authenticateToken, authorizeRoles } = require('../app/middleware/authmiddleware');

// Route lấy danh sách gia sư
router.get('/', tutorController.show);
router.get('/updateInfo', authenticateToken, authorizeRoles('tutor'),tutorController.updateInforForm);
router.post('/updateInfo',authenticateToken, authorizeRoles('tutor'),tutorController.updateInfor);


router.get('/:slug', tutorController.showDetail);
router.get('/:slug/rating', tutorController.getRatings);



module.exports = router;
