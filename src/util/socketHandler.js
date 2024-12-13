const Message = require('../app/models/Message'); // Import model Message nếu cần

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Lắng nghe sự kiện gửi tin nhắn
        socket.on('sendMessage', async (data) => {
            const { senderId, receiverId, content } = data;
            try {
                const newMessage = new Message({ senderId, receiverId, content });
                await newMessage.save();

                // Gửi tin nhắn đến người nhận
                io.to(receiverId).emit('newMessage', newMessage); 
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });

        // Lắng nghe sự kiện ngắt kết nối
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    });
};
