const Booking = require("../../models/Booking");
const Place = require("../../models/Place");
const User = require("../../models/User");

const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate("place");
    return res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

const createBooking = async (req, res, next) => {
  try {
    const { place, date, time, specialInstructions, persons } = req.body;
    const newBooking = await Booking.create({
      place,
      date,
      time,
      specialInstructions,
      persons,
      user: req.user.id,
    });
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        bookings: newBooking._id,
      },
    });

    await Place.findByIdAndUpdate(place, {
      $push: {
        bookings: newBooking._id,
      },
    });
    res.status(201).json(newBooking);
  } catch (error) {
    next(error);
  }
};
// add the payment feature to createBooking

const deleteBooking = async (req, res, next) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const updateBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    await Booking.findByIdAndUpdate(id, req.body);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
// const updateData = async (req, res, next) => {
//   try {
//     const { title } = req.body;
//     const image = req.file ? req.file.path : null;

//     const updateData = { title };
//     if (image) updateData.image = image;

//     await Category.findByIdAndUpdate(req.params.id, updateData);
//     res.status(204).end();
//   } catch (error) {
//     next(error);
//   }
// };

const getOneBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("place");
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBookings,
  createBooking,
  deleteBooking,
  updateBooking,
  getOneBooking,
};
