const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../app/middleware/authmiddleware');
const messageController = require('../app/controllers/MessageController');

router.post(
    '/send', authenticateToken,
    messageController.sendMessage
);

router.post(
    '/reply',
    authenticateToken,
    authorizeRoles('admin'),
    messageController.replyToMessage
);

router.get(
    '/history/:chatRoomId',
    authenticateToken,
    authorizeRoles('parent', 'tutor', 'admin'),
    messageController.getChatHistory
);

router.get(
    '/:senderSlug/:receiverSlug',
    authenticateToken,
    authorizeRoles('parent', 'tutor', 'admin'),
    messageController.getMessages
);


router.put(
    '/:slug/read',
    authenticateToken,
    authorizeRoles('parent', 'tutor'),
);


module.exports = router;
