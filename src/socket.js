const jwt = require("jsonwebtoken");
const Message = require("./app/models/Message");
const User = require("./app/models/user");
const MessageController = require("./app/controllers/MessageController");
const key = require("./config/auth.config");

let ioInstance;
const userSocketMap = {}; // Map lưu trữ userId và socketId

module.exports.getUserSocketId = (userId) => userSocketMap[userId];

module.exports.initSocket = (io) => {
  ioInstance = io;

  // Middleware xác thực JWT
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    jwt.verify(token, key.secret, (err, decoded) => {
      if (err) {
        return next(new Error("Authentication error: Invalid token"));
      }
      socket.userId = decoded.id;
      socket.role = decoded.role;
      console.log(`Connected: UserID=${socket.userId}, Role=${socket.role}`);
      next();
    });
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;
    const role = socket.role;

    console.log(`User ${userId} (${role}) connected with socket ID ${socket.id}`);

    // Lưu socket ID vào userSocketMap
    userSocketMap[userId] = socket.id;

    // Gửi tin nhắn gần đây
    socket.on("recent-messages", async () => {
      try {
        const recentMessages = await MessageController.getMessagesUser(userId);
        console.log('re',recentMessages)
        socket.emit("recent-messages", recentMessages);
      } catch (error) {
        console.error("Error retrieving messages:", error);
      }
    });

    // Tải tin nhắn cũ
    socket.on("load old message", async ({ email }) => {
      try {
        const receiver = await User.findOne({ email });
        if (!receiver) {
          socket.emit("error", { message: "Receiver not found" });
          return;
        }

        const messages = await Message.find({
          $or: [
            { senderId: userId, receiverId: receiver._id },
            { receiverId: userId, senderId: receiver._id },
          ],
        }).sort({ timestamp: 1 });

        const modifiedMessages = messages.map((msg) => ({
          ...msg._doc,
          sender: msg.sender.toString() === userId ? "You" : receiver.email,
          receiver: msg.receiver.toString() === userId ? "You" : receiver.email,
        }));

        socket.emit("load old messages", modifiedMessages);
      } catch (error) {
        console.error("Error loading messages:", error);
        socket.emit("error", { message: "Failed to load messages" });
      }
    });

    // Xử lý gửi tin nhắn
    socket.on("chat message", async ({ receiverId, content }) => {
      try {
        const numericReceiverId = parseInt(receiverId, 10);
        const chatRoomId = [Math.min(userId, numericReceiverId), Math.max(userId, numericReceiverId)].join("-");

        const newMessage = new Message({
          senderId: userId,
          receiverId: numericReceiverId,
          content,
         // chatRoomId: `${userId}-${numericReceiverId}`,
          chatRoomId: chatRoomId,
          timestamp: new Date(),
        });

        await newMessage.save();

        // Gửi tin nhắn cho người nhận
        const receiverSocketId = userSocketMap[numericReceiverId];
      
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("chat message", {
            _id: newMessage._id,
            senderId: userId,
            receiverId: numericReceiverId,
            content,
           // chatRoomId: `${userId}-${numericReceiverId}`,
            chatRoomId: chatRoomId,
            timestamp: newMessage.timestamp,
          });
        }
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Tải tin nhắn theo chatRoomId
    socket.on("load-messages", async ({ chatRoomId }) => {
      try {
        const messages = await Message.find({ chatRoomId }).sort({ timestamp: 1 });
        console.log('load',messages)
        socket.emit("load-messages", messages);
      } catch (error) {
        console.error("Error loading messages:", error);
        socket.emit("error", { message: "Failed to load messages" });
      }
    });

    // Xử lý khi người dùng ngắt kết nối
    socket.on("disconnect", () => {
      delete userSocketMap[userId];
      console.log(`User ${userId} disconnected`);
    });
  });
};

module.exports.getIo = () => {
  if (!ioInstance) {
    throw new Error("Socket.io not initialized!");
  }
  return ioInstance;
};
