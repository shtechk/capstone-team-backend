const express = require("express");

const passport = require("./config/passport"); // Ensure passport is required and configured
const dotenv = require("dotenv");
const connectDB = require("./config/database"); // Import the database connection
const userRoutes = require("./api/user/routes");
const businessRoutes = require("./api/business/routes");
const voucherRouter = require("./apis/vouchers/routes");
const ratingRouter = require("./apis/ratings/routes");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const notFoundHandler = require("./middlewares/notFoundHandler");
const errorHandler = require("./middlewares/errorHandler");
const categoryRouter = require("./apis/category/routes");
const placeRouter = require("./apis/place/routes");
const bookingRouter = require("./apis/booking/routes");
const chatRouter = require("./apis/chat/routes");
const notificationRouter = require("./apis/notification/routes");

const app = express();
// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

app.use(express.json());
app.use("/media", express.static(path.join(__dirname, "media")));
app.use(cors());
app.use(morgan("dev"));
// Initialize Passport.js
app.use(passport.initialize());

// Register routes
app.use("/api/users", userRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/vouchers", voucherRouter);
app.use("/ratings", ratingRouter);

//Routes here...
app.use("/apis/category", categoryRouter);
app.use("/apis/place", placeRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/chats", chatRouter);
app.use("/apis/notification", notificationRouter);
app.use(errorHandler);
app.use(notFoundHandler);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
