const Notification = require("../../models/Notification");

const createNewNotification = async (req, res, next) => {
  try {
    if (req.body.user) {
      const newNotification = new Notification({
        message: "New message!",
        user: req.body.user, // Replace with an actual user ID
      });
      await newNotification.save();
      console.log("Notification saved successfully!");
      return res.status(201).json(newNotification);
    } else {
      return res.status(400).json({ error: "User ID is required." });
    }
  } catch (error) {
    next(error);
  }
};

const getAllNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find();
    return res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

module.exports = { createNewNotification, getAllNotifications };
