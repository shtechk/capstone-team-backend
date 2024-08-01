const { model, Schema } = require("mongoose");

const PlaceSchema = new Schema({
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to the user who owns the place
  name: { type: String, required: true }, // Place name
  description: { type: String, required: true }, // Description of the place
  image: { type: String, required: true }, // URL to an image of the place
  mode: { type: String, required: true }, // Mode of operation (e.g., quiet, study place)
  time: { type: String, required: true }, // Operational time of the place
  date: { type: Date, required: true }, // Operational date of the place
  timings: { type: String, required: true }, // Timings of the place
  mood: { type: String, required: true }, // Additional place-specific details
  food: { type: String, required: true },
  drinks: { type: String, required: true },
  service: { type: String, required: true },
  parking: { type: String, required: true },
  bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
  ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
  location: {
    type: {
      type: String, // 'location.type' must be 'Point'
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  }, // Location of the place
  status: {
    type: String,
    enum: [
      "active",
      "inactive",
      "pending_creation",
      "pending_update",
      "rejected_creation",
      "rejected_update",
    ],
    required: true,
    default: "pending_creation",
  }, // Status of the place
  rejection_reason: { type: String }, // Reason for rejection, if applicable
  createdAt: { type: Date, default: Date.now }, // Timestamp of place creation
  updatedAt: { type: Date, default: Date.now }, // Timestamp of last update
  proposed_changes: {
    name: { type: String },
    description: { type: String },
    image: { type: String },
    mode: { type: String },
    time: { type: String },
    date: { type: Date },
    timings: { type: String },
    mood: { type: String },
    food: { type: String },
    drinks: { type: String },
    service: { type: String },
    parking: { type: String },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
  }, // Proposed changes for update requests
});

module.exports = model("Place", PlaceSchema);
