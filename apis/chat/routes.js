const express = require("express");
const {
  getAllChats,
  createChat,
  deleteChat,
  updateChat,
  getOneChat,
} = require("./controller");

const chatRouter = express.Router();

chatRouter.get("/", getAllChats);
chatRouter.post("/", createChat);
chatRouter.delete("/:id", deleteChat);
chatRouter.put("/:id", updateChat);
chatRouter.get("/:id", getOneChat);

module.exports = chatRouter;
