const express = require("express");
const { createNewNotification, getAllNotifications } = require("./controller");
const upload = require("../../middlewares/multer");
const notificationRouter = express.Router();

notificationRouter.get("/", getAllNotifications);
notificationRouter.post("/", upload.single("image"), createNewNotification);

module.exports = notificationRouter;
