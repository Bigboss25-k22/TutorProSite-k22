const Message = require('../models/Message');
const Tutor = require('../models/Tutor');
const Course = require('../models/Course');
const { mongooseToObject } = require('../../util/mongoose');


class MessageController {
    async sendMessage(req, res, next) {
        try {
            const { content } = req.body;
            const senderId= req.user.id;
           
            const  receiverId=111;
            // Tạo tin nhắn mới, chỉ cho phép gửi đến Admin
            const newMessage = new Message({
                senderId,
                receiverId:receiverId,
                chatRoomId : senderId + '-' + receiverId,
                content,
            });
    
            await newMessage.save();
    
            res.status(201).json({
                message: 'Message sent successfully to Admin',
                data: mongooseToObject(newMessage),
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error sending message', error });
        }
    }

    async replyToMessage(req, res, next) {
        try {
            const { content, receiverId } = req.body; // Admin nhập nội dung và chọn người nhận
            const senderId = req.user.id; 
    
            // Tạo tin nhắn mới
            const newMessage = new Message({
                senderId,
                receiverId,
                chatRoomId: receiverId + '-' + senderId , // Hoặc dựa vào ID đã tồn tại giữa 2 người
                content,
            });
    
            await newMessage.save();
    
            res.status(201).json({
                message: 'Reply sent successfully',
                data: mongooseToObject(newMessage),
            });
    
            // (Optional) Phát tin nhắn mới qua WebSocket cho người nhận
            const receiverSocket = io.sockets.sockets.get(receiverId); // Kiểm tra người nhận online
            if (receiverSocket) {
                io.to(receiverId).emit('newMessage', newMessage);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error sending reply', error });
        }
    }
    
    // Lấy danh sách tin nhắn giữa 2 người dùng
    async getMessages(req, res, next) {
        try {
            const { senderSlug, receiverSlug } = req.params;

            const messages = await Message.find({
                $or: [
                    { senderSlug, receiverSlug },
                    { senderSlug: receiverSlug, receiverSlug: senderSlug },
                ],
            }).sort({ timestamp: 1 }); // Sắp xếp theo thời gian

            if (!messages || messages.length === 0) {
                return res.status(404).json({ message: 'No messages found between users' });
            }

            res.status(200).json({
                message: 'Messages retrieved successfully',
                data: messages.map(mongooseToObject),
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error retrieving messages', error });
        }
    }

    // Đánh dấu tin nhắn là đã đọc
    async markAsRead(req, res, next) {
        try {
            const { slug } = req.params;

            const message = await Message.findOne({ slug });
            if (!message) {
                return res.status(404).json({ message: 'Message not found' });
            }

            message.isRead = true;
            await message.save();

            res.status(200).json({
                message: 'Message marked as read successfully',
                data: mongooseToObject(message),
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error marking message as read', error });
        }
    }

    async getChatHistory(req, res, next) {
        try {
            const { chatRoomId } = req.params;
            const messages = await Message.find({ chatRoomId }).sort({ timestamp: 1 });
           

            if (!messages.length) {
                return res.status(404).json({ message: 'No messages found' });
            }


            res.status(200).json({
                message: 'Chat history retrieved successfully',
                data: messages.map(mongooseToObject),
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error retrieving chat history', error });
        }
    }

}

module.exports = new MessageController();
