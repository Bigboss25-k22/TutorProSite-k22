const express = require('express');
const router = express.Router();

const transactionController = require('../app/controllers/TransactionController'); // Đảm bảo đường dẫn đúng
const { authenticateToken, authorizeRoles } = require('../app/middleware/authmiddleware');




// Lấy danh sách giao dịch của gia sư hiện tại
router.get('/', authenticateToken,authorizeRoles('tutor'), transactionController.getTransactionsByTutor);

// Xử lý thanh toán
router.post('/processPayment', authenticateToken,authorizeRoles('tutor'), transactionController.processPayment);

// Lấy tất cả giao dịch (chỉ dành cho admin)
router.get('/all', authenticateToken, authorizeRoles('admin'), transactionController.getAllTransactions);

// Tạo giao dịch mới từ slug khóa học
router.post('/:slug', authenticateToken,authorizeRoles('tutor'), transactionController.createTransaction);







module.exports = router;
