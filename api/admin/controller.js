const User = require("../../models/User");
const Place = require("../../models/Place");

// Fetch all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch all places
exports.getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find({});
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send notifications
exports.sendNotifications = async (req, res) => {
  const { message } = req.body;
  try {
    // Implement the logic to send notifications to all users
    res.json({ message: "Notifications sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
