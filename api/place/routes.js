const express = require("express");
const router = express.Router();
const placeController = require("./controller");
const {
  ensureAuthenticated,
  ensureAdmin,
  ensureBusiness,
} = require("../../middlewares/auth");

// Route for fetching all place requests
router.get(
  "/requests",
  ensureAuthenticated,
  ensureAdmin,
  placeController.getAllPlaceRequests
);

// Route for fetching details of the current user's place
router.get(
  "/bookings",
  ensureAuthenticated,
  ensureBusiness,
  placeController.viewPlaceBookingRequests
);

// Route for fetching all places
router.get(
  "/all",
  ensureAuthenticated,
  ensureAdmin,
  placeController.getAllPlaces
);

// Route for submitting a place registration request
router.post(
  "/register",
  ensureAuthenticated,
  ensureBusiness,
  placeController.submitPlaceRegistration
);

// Route for admin to approve or reject a place registration request
router.put(
  "/approve/:id",
  ensureAuthenticated,
  ensureAdmin,
  placeController.approveOrRejectPlaceRegistration
);

// Route for submitting a place update request
router.put(
  "/update/:id",
  ensureAuthenticated,
  ensureBusiness,
  placeController.submitPlaceUpdate
);

// Route for accepting a booking request
router.put(
  "/bookings/accept/:id",
  ensureAuthenticated,
  ensureBusiness,
  placeController.acceptPlaceBookingRequest
);

// Route for rejecting a booking request
router.put(
  "/bookings/reject/:id",
  ensureAuthenticated,
  ensureBusiness,
  placeController.rejectPlaceBookingRequest
);

// Route for fetching place by ID
router.get("/:id", ensureAuthenticated, placeController.getPlaceById);

module.exports = router;
