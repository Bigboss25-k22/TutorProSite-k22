const express = require('express');
const router = express.Router();

const tutorController = require('../app/controllers/TutorController'); // Đảm bảo đường dẫn đúng

// Route lấy danh sách gia sư
router.get('/', tutorController.show);

module.exports = router;
