const { model, Schema } = require("mongoose");

const BookingSchema = new Schema({
  place: { type: Schema.Types.ObjectId, ref: "Place", required: true },
  date: { type: Date, default: Date.now, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, required: true },
  specialInstructions: { type: String, required: true },
  persons: { type: Number, required: true },
});

module.exports = mongoose.model("Booking", BookingSchema);
