const Booking = require("../../models/Booking");
const Place = require("../../models/Place");
const User = require("../../models/User");

// Middleware for role validation
const checkBusinessUserRole = (req, res, next) => {
  if (req.user.role !== "business") {
    return res
      .status(403)
      .json({ message: "Only business users can register a place" });
  }
  next();
};

// Fetch all place requests
exports.getAllPlaceRequests = async (req, res) => {
  try {
    const places = await Place.find({
      status: { $in: ["pending_creation", "pending_update"] },
    });
    res.status(200).json(places);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching place requests", error });
  }
};

// Fetch details of the current user's place
exports.getMyPlace = async (req, res) => {
  try {
    const place = await Place.findOne({ owner_id: req.user._id });

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.status(200).json(place);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Fetch all places
exports.getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json(places);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching places", error });
  }
};

// Fetch place details by ID
exports.getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.status(200).json(place);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPlaceBookingRequests = async () => {
  const { data } = await instance.get("/bookings/place");
  return data;
};

// Update booking status
exports.updateBookingStatus = async (bookingId, status) => {
  const { data } = await instance.put(`/bookings/${bookingId}`, { status });
  return data;
};

// Submit a place registration request
exports.submitPlaceRegistration = [
  checkBusinessUserRole,
  async (req, res) => {
    try {
      const place = new Place({
        owner_id: req.user._id,
        name: req.body.name,
        time: req.body.time,
        date: req.body.date,
        location: req.body.location,
        description: req.body.description,
        image: req.body.image,
        mode: req.body.mode,
        status: "pending_creation",
      });
      await place.save();
      res
        .status(201)
        .json({ message: "Place registration request submitted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error submitting place registration request",
        error,
      });
    }
  },
];

// Approve or reject place registration request
exports.approveOrRejectPlaceRegistration = async (req, res) => {
  try {
    const { status, rejection_reason } = req.body;
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res
        .status(404)
        .json({ message: "Place registration request not found" });
    }

    if (status === "rejected_creation" || status === "rejected_update") {
      place.status = status;
      place.rejection_reason = rejection_reason;
    } else if (status === "approved") {
      place.status = "active";
      if (place.status === "pending_update") {
        Object.assign(place, place.proposed_changes);
        place.proposed_changes = {};
      }
    } else {
      return res.status(400).json({ message: "Invalid status" });
    }

    await place.save();
    res
      .status(200)
      .json({ message: `Place registration request ${status} successfully` });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error processing place registration request", error });
  }
};

// Submit a place update request
exports.submitPlaceUpdate = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    place.proposed_changes = {
      name: req.body.name,
      time: req.body.time,
      date: req.body.date,
      location: req.body.location,
      description: req.body.description,
      image: req.body.image,
      mode: req.body.mode,
    };
    place.status = "pending_update";
    await place.save();

    res
      .status(200)
      .json({ message: "Place update request submitted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error submitting place update request", error });
  }
};

// Booking management
// Booking management
exports.viewPlaceBookingRequests = async (req, res) => {
  try {
    console.log("User ID:", req.user._id); // Log user ID

    const place = await Place.findOne({ owner_id: req.user._id });

    if (!place) {
      console.log("Place not found for user:", req.user._id); // Debugging
      return res.status(404).json({ message: "Place not found" });
    }

    console.log("Place found:", place._id); // Debugging

    const bookings = await Booking.find({
      place: place._id,
      status: "pending",
    }).populate("user");

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching place bookings:", error);
    res.status(500).json({ message: error.message });
  }
};

// Accept booking request
exports.acceptPlaceBookingRequest = async (req, res) => {
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

// Reject booking request
exports.rejectPlaceBookingRequest = async (req, res) => {
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

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
