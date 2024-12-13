const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../app/middleware/authmiddleware');
const messageController = require('../app/controllers/MessageController');

// Gửi tin nhắn (cho phép cả khách chưa đăng nhập và người dùng đã đăng nhập)
router.post(
    '/send',authenticateToken,
    messageController.sendMessage
);
// Admin trả lời tin nhắn người dùng
router.post(
    '/reply', 
    authenticateToken, 
    authorizeRoles('admin'), // Chỉ Admin được phép trả lời
    messageController.replyToMessage
);

router.get(
    '/history/:chatRoomId',
    authenticateToken, // Xác thực token
    authorizeRoles('parent', 'tutor', 'admin'), // Chỉ cho phép những người liên quan
    messageController.getChatHistory // Gọi tới hàm trong MessageController
);
// Lấy danh sách tin nhắn giữa hai người dùng (chỉ cho phép người liên quan xem)
router.get(
    '/:senderSlug/:receiverSlug',
    authenticateToken, // Xác thực token nếu người dùng đã đăng nhập
    authorizeRoles('parent', 'tutor', 'admin'), // Cho phép Parent, Tutor, hoặc Admin xem tin nhắn
    messageController.getMessages
);

// Đánh dấu tin nhắn là đã đọc (dựa trên slug)
router.put(
    '/:slug/read',
    authenticateToken, // Xác thực token
    authorizeRoles('parent', 'tutor'), // Chỉ người liên quan mới được phép đánh dấu đã đọc
    messageController.markAsRead
);




module.exports = router;
