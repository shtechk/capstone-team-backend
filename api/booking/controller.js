const Booking = require("../../models/Booking");
const Business = require("../../models/Business");

// Create a booking
exports.createBooking = async (req, res) => {
  try {
    const { place, date, specialInstructions, persons } = req.body;
    const business = await Business.findById(place);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const booking = new Booking({
      place,
      date,
      user: req.user._id,
      status: "pending",
      specialInstructions,
      persons,
    });

    await booking.save();
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch bookings for a user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate(
      "place"
    );
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch bookings for a business
exports.getBusinessBookings = async (req, res) => {
  try {
    const business = await Business.findOne({ owner_id: req.user._id });
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const bookings = await Booking.find({ place: business._id }).populate(
      "user"
    );
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.getBusinessBookings = async (req, res) => {
//   try {
//     const business = await Business.findOne({ owner_id: req.user._id });
//     if (!business) {
//       return res.status(404).json({ message: "Business not found" });
//     }

//     const bookings = await Booking.find({
//       place: business._id,
//       status: "pending",
//     }).populate("user");
//     res.status(200).json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Update booking status

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate({
      path: "place",
      model: "Business",
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Debug logs
    console.log(`Booking ID: ${booking._id}`);
    console.log(
      `Place ID: ${booking.place ? booking.place._id : "Place not found"}`
    );
    console.log(
      `Owner ID: ${booking.place ? booking.place.owner_id : "Owner not found"}`
    );
    console.log(`User ID: ${req.user._id}`);

    // Ensure the business is found and its owner is the one making the request
    if (
      !booking.place ||
      !booking.place.owner_id ||
      booking.place.owner_id.toString() !== req.user._id.toString()
    ) {
      console.log("Unauthorized access attempt");
      return res.status(403).json({ message: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ message: `Booking ${status} successfully` });
  } catch (error) {
    console.error("Error updating booking status:", error); // Log the detailed error
    res.status(500).json({ message: error.message });
  }
};
