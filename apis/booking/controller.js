const Booking = require("../../models/Booking");
const User = require("../../models/User");

const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find();
    return res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

const createBooking = async (req, res, next) => {
  try {
    req.body.booking = req.body.bookingId;
    const newBooking = await Booking.create(req.body);
    await User.findByIdAndUpdate(req.body.userId, {
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
    await Booking.findByIdAndRemove({ _id: req.booking.id });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const updateBooking = async (req, res, next) => {
  try {
    await Booking.findByIdAndUpdate(req.booking.id, req.body);
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
    const booking = await Booking.findById(req.params.id);
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
