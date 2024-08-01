const express = require("express");

const upload = require("../../middlewares/multer");
const {
  getMyNotifications,
  sendOneNotification,
  sendNotificationForAll,
  checkIsRead,
  markNotificationAsRead,
} = require("./controller");
const notificationRouter = express.Router();

notificationRouter.get("/", getMyNotifications);
notificationRouter.post("/:_id", sendOneNotification);
notificationRouter.post("/", sendNotificationForAll);
notificationRouter.post("/mark-as-read", markNotificationAsRead);

module.exports = notificationRouter;
