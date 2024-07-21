const { model, Schema } = require("mongoose");

const PlaceSchema = new Schema({
  name: { type: String, required: true },
  mood: { type: String, required: true },
  food: { type: String, required: true },
  drinks: { type: String, required: true },
  service: { type: String, required: true },
  parking: { type: String, required: true },
  images: { type: String, default: "link", required: true },
  bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
  ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true },
  },
});

module.exports = mongoose.model("Place", PlaceSchema);
