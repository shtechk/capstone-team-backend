const express = require("express");
const {
  getAllBookings,
  createBooking,
  deleteBooking,
  updateBooking,
  getOneBooking,
} = require("./controller");

const bookingRouter = express.Router();

bookingRouter.get("/", getAllBookings);
bookingRouter.post("/", createBooking);
bookingRouter.delete("/:id", deleteBooking);
bookingRouter.put("/:id", updateBooking);
bookingRouter.get("/:id", getOneBooking);

module.exports = bookingRouter;
