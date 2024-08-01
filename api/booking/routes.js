// api/booking/routes.js
const express = require("express");
const router = express.Router();
const bookingController = require("./controller");
const {
  ensureAuthenticated,
  ensureBusiness,
} = require("../../middlewares/auth");

// Route for creating a booking
router.post("/", ensureAuthenticated, bookingController.createBooking);

// Route for fetching user bookings
router.get("/user", ensureAuthenticated, bookingController.getUserBookings);

// Route for fetching bookings for a place
router.get(
  "/place",
  ensureAuthenticated,
  ensureBusiness,
  bookingController.getPlaceBookings
);

// Route for updating booking status
router.put(
  "/:id",
  ensureAuthenticated,
  ensureBusiness,
  bookingController.updateBookingStatus
);

module.exports = router;
