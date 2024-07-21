const express = require("express");
const passport = require("./config/passport"); // Ensure passport is required and configured
const dotenv = require("dotenv");
const connectDB = require("./config/database"); // Import the database connection
const userRoutes = require("./api/user/routes");
const businessRoutes = require("./api/business/routes");
const errorHandler = require("./middlewares/errorHandler"); // Assuming you have this middleware
const notFoundHandler = require("./middlewares/notFoundHandler"); // Assuming you have this middleware
const morgan = require("morgan");

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize Passport.js
app.use(passport.initialize());

app.use(morgan("dev"));

// Register routes
app.use("/api/users", userRoutes);
app.use("/api/businesses", businessRoutes);

// Error handling middleware
app.use(errorHandler);
app.use(notFoundHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
