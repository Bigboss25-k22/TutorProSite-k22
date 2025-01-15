const Message = require("../models/Message");

/**
 * Get all chat rooms and the latest messages for a user.
 * @param {String} userId - The ID of the user.
 * @returns {Promise<Array>} - A list of chat rooms with the latest messages.
 */
const GetAllMsgs = async (userId) => {
  try {
    // Find all unique chat rooms for the user
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { receiver: userId },
          ],
        },
      },
      {
        $sort: { createdAt: -1 }, // Sort by the latest message
      },
      {
        $group: {
          _id: {
            sender: "$sender",
            receiver: "$receiver",
          },
          latestMessage: { $first: "$$ROOT" },
        },
      },
    ]);

    // Map the aggregated results to user-friendly data
    const chatRooms = messages.map((chat) => {
      const isSender = chat._id.sender.toString() === userId;
      return {
        chatWith: isSender ? chat._id.receiver : chat._id.sender,
        latestMessage: chat.latestMessage.content,
        timestamp: chat.latestMessage.createdAt,
        readed: chat.latestMessage.readed,
      };
    });

    return chatRooms;
  } catch (error) {
    console.error("Error fetching chat rooms and messages:", error);
    throw new Error("Failed to fetch messages.");
  }
};

module.exports = {
  GetAllMsgs,
};
