const express = require("express");
const router = express.Router();
const adminController = require("./controller");
const { ensureAuthenticated, ensureAdmin } = require("../../middlewares/auth");

// User management
router.get(
  "/users",
  ensureAuthenticated,
  ensureAdmin,
  adminController.getAllUsers
);

// Place management
router.get(
  "/places",
  ensureAuthenticated,
  ensureAdmin,
  adminController.getAllPlaces
);

// Send notifications
router.post(
  "/notifications",
  ensureAuthenticated,
  ensureAdmin,
  adminController.sendNotifications
);

module.exports = router;
