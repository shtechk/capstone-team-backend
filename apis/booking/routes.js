const express = require("express");
const {
  getAllBookings,
  createBooking,
  deleteBooking,
  updateBooking,
  getOneBooking,
} = require("./controller");
const { ensureAuthenticated } = require("../../middlewares/auth");

const bookingRouter = express.Router();

bookingRouter.get("/", getAllBookings);
bookingRouter.post("/", ensureAuthenticated, createBooking);
bookingRouter.delete("/:id", deleteBooking);
bookingRouter.put("/:id", ensureAuthenticated, updateBooking);
bookingRouter.get("/:id", getOneBooking);

module.exports = bookingRouter;
