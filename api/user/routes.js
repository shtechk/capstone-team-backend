const express = require("express");
const router = express.Router();
const userController = require("./controller");
const { ensureAuthenticated } = require("../../middlewares/auth");
const upload = require("../../middlewares/multer");

// Public routes that do not require authentication
router.post(
  "/register",
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "business_image", maxCount: 1 },
  ]),
  userController.register
);
router.post("/login", userController.login);
router.post("/verify-email", userController.verifyEmail);

// Protected route that requires authentication
router.put(
  "/update/:id",
  ensureAuthenticated,
  upload.single("image"),
  userController.updateUser
);

// Admin route for approving or rejecting place registrations
router.put("/approve/:id", ensureAuthenticated, userController.approvePlace);
router.get("/profile", ensureAuthenticated, userController.getUserProfile);
router.get("/", userController.getAllUsers);

module.exports = router;
