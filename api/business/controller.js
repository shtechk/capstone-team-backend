const Booking = require("../../models/Booking");
const Business = require("../../models/Business");
const User = require("../../models/User");
const mongoose = require("mongoose");

// Middleware for role validation
const checkBusinessUserRole = (req, res, next) => {
  if (req.user.role !== "business") {
    return res
      .status(403)
      .json({ message: "Only business users can register a business" });
  }
  next();
};

exports.getMyBusiness = async (req, res, next) => {
  try {
    // Find the business by the owner ID
    const business = await Business.findOne({ owner_id: req.user._id });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Find bookings for this business and populate user details
    const bookings = await Booking.find({ place: business._id }).populate(
      "user"
    );

    res.status(200).json({ business, bookings });
  } catch (error) {
    next(error);
  }
};
// Fetch business details by ID
exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }
    res.status(200).json(business);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Submit a business registration request
exports.submitBusinessRegistration = [
  checkBusinessUserRole,
  async (req, res) => {
    try {
      const business = new Business({
        owner_id: req.user._id, // Assuming the user is authenticated
        name: req.body.name,
        time: req.body.time,
        date: req.body.date,
        location: req.body.location,
        description: req.body.description,
        image: req.body.image,
        mode: req.body.mode,
        status: "pending_creation", // Set status to pending_creation
      });
      await business.save();
      res.status(201).json({
        message: "Business registration request submitted successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error submitting business registration request",
        error,
      });
    }
  },
];

// Approve or reject business registration request
exports.approveOrRejectBusinessRegistration = async (req, res) => {
  try {
    const { status, rejection_reason } = req.body;
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res
        .status(404)
        .json({ message: "Business registration request not found" });
    }

    switch (status) {
      case "rejected_creation":
      case "rejected_update":
        business.status = status;
        business.rejection_reason = rejection_reason;
        break;
      case "approved":
        business.status = "active"; // Directly set the status to 'active' when approved
        if (business.status === "pending_update") {
          // Apply the proposed changes if it's an update request
          Object.assign(business, business.proposed_changes);
          business.proposed_changes = {}; // Clear proposed changes after approval
        }
        break;
      default:
        return res.status(400).json({ message: "Invalid status" });
    }

    await business.save();
    res.status(200).json({
      message: `Business registration request ${status} successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error processing business registration request",
      error,
    });
  }
};

// Submit a business update request
exports.submitBusinessUpdate = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    business.proposed_changes = {
      name: req.body.name,
      time: req.body.time,
      date: req.body.date,
      location: req.body.location,
      description: req.body.description,
      image: req.body.image,
      mode: req.body.mode,
    };
    business.status = "pending_update";
    await business.save();

    res
      .status(200)
      .json({ message: "Business update request submitted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error submitting business update request", error });
  }
};

// Fetch all business requests
exports.getAllBusinessRequests = async (req, res) => {
  try {
    const businesses = await Business.find({
      status: { $in: ["pending_creation", "pending_update"] },
    });
    res.status(200).json(businesses);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching business requests", error });
  }
};

// Fetch business profile details
exports.getBusinessProfile = async (req, res) => {
  try {
    const business = await Business.findOne({ owner_id: req.user._id });
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }
    res.json(business);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Booking management
exports.viewBookingRequests = async (req, res) => {
  try {
    const business = await Business.findOne({ owner_id: req.user._id });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const bookings = await Booking.find({
      place: business._id,
      status: "pending",
    }).populate("user");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.acceptBookingRequest = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    booking.status = "accepted";
    await booking.save();
    res.json({ message: "Booking accepted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rejectBookingRequest = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    booking.status = "rejected";
    await booking.save();
    res.json({ message: "Booking rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
