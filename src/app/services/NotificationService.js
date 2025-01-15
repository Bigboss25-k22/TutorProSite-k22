const Notification = require("../models/Notification");

/**
 * Get the count of unread notifications for a user.
 * @param {String} userId - The ID of the user.
 * @returns {Promise<Number>} - The count of unread notifications.
 */
const getLengthNotificationsUnRead = async (userId) => {
  try {
    const unreadCount = await Notification.countDocuments({
      user: userId,
      read: false, // Assuming `read` is a boolean indicating whether the notification is read.
    });
    return unreadCount;
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    throw new Error("Failed to fetch unread notifications.");
  }
};

module.exports = {
  getLengthNotificationsUnRead,
};
