const Notification = require("../../models/Notification");
const User = require("../../models/User");
const sendEXPONotification = require("../../utils/notificationsSetup");

const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id });
    return res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

const sendOneNotification = async (req, res, next) => {
  try {
    const user = await User.findById(req.params._id);
    if (user.notification_token) {
      sendEXPONotification(
        user.notification_token,
        req.body.body,
        req.body.title
      );

      await Notification.create({
        user: user._id,
        title: req.body.title,
        body: req.body.body,
      });
    }
    return res.status(201).end();
  } catch (error) {
    next(error);
  }
};

// To check if the user have seen the notification or not yet!!

const markNotificationAsRead = async (req, res, next) => {
  try {
    // Assuming 'notificationId' is passed in the request to identify the notification
    const { notificationId } = req.body;

    // Find the notification by ID and update the 'isRead' field to true
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true } // This option returns the updated document
    );

    // If the notification was updated successfully, send a response back
    if (updatedNotification) {
      res
        .status(200)
        .json({ message: "Notification marked as read", updatedNotification });
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    next(error);
  }
};

const sendNotificationForAll = async (req, res, next) => {
  try {
    // Retrieve all users from the database
    const users = await User.find({});

    // Use map to iterate over the users and send notifications
    await Promise.all(
      users.map(async (user) => {
        if (user.notification_token) {
          await sendEXPONotification(
            user.notification_token,
            req.body.body,
            req.body.title
          );

          await Notification.create({
            user: user._id,
            title: req.body.title,
            body: req.body.body,
          });
        }
      })
    );
    // Handle successful notifications
    res.status(200).send("Notifications sent successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendOneNotification,
  getMyNotifications,
  sendNotificationForAll,
  markNotificationAsRead,
};
