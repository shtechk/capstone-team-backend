const express = require("express");
const router = express.Router();
const businessController = require("./controller");
const {
  ensureAuthenticated,
  ensureAdmin,
  ensureBusiness,
} = require("../../middlewares/auth");

// Route for fetching all business requests - should be before the parameterized route
router.get(
  "/requests",
  ensureAuthenticated,
  ensureAdmin,
  businessController.getAllBusinessRequests
);

// Parameterized route
router.get("/", ensureAuthenticated, businessController.getMyBusiness);
router.get("/:id", businessController.getBusinessById);

// Route for submitting a business registration request
router.post(
  "/register",
  ensureAuthenticated,
  ensureBusiness,
  businessController.submitBusinessRegistration
);

// Route for admin to approve or reject a business registration request
router.put(
  "/approve/:id",
  ensureAuthenticated,
  ensureAdmin,
  businessController.approveOrRejectBusinessRegistration
);

// Route for submitting a business update request
router.put(
  "/update/:id",
  ensureAuthenticated,
  ensureBusiness,
  businessController.submitBusinessUpdate
);

module.exports = router;
