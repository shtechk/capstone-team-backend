const Booking = require("../../models/Booking");
const User = require("../../models/User");

const getAllChats = async (req, res, next) => {
  try {
    const chats = await Chat.find();
    return res.status(200).json(chats);
  } catch (error) {
    next(error);
  }
};

const createChat = async (req, res, next) => {
  try {
    const chat = await Chat.create(req.body);
    return res.status(201).json(chat);
  } catch (error) {
    next(error);
  }
};

const deleteChat = async (req, res, next) => {
  try {
    await Chat.findByIdAndRemove({ _id: req.chat.id });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const updateChat = async (req, res, next) => {
  try {
    await Chat.findByIdAndUpdate(req.chat.id, req.body);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const getOneChat = async (req, res, next) => {
  try {
    const chat = await chat.findById(req.params.id);
    res.json(chat);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllChats,
  createChat,
  deleteChat,
  updateChat,
  getOneChat,
};
