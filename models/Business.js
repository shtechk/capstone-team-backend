const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema({
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to the user who owns the business
  name: { type: String, required: true }, // Business name
  time: { type: String, required: true }, // Operational time of the business
  date: { type: Date, required: true }, // Operational date of the business
  location: { type: String, required: true }, // Location of the business
  description: { type: String, required: true }, // Description of the business
  image: { type: String, required: true }, // URL to an image of the business
  mode: { type: String, required: true }, // Mode of operation (e.g., quiet, study place)
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
  }, // Status of the business
  rejection_reason: { type: String }, // Reason for rejection, if applicable
  createdAt: { type: Date, default: Date.now }, // Timestamp of business creation
  updatedAt: { type: Date, default: Date.now }, // Timestamp of last update
  proposed_changes: {
    name: { type: String },
    time: { type: String },
    date: { type: Date },
    location: { type: String },
    description: { type: String },
    image: { type: String },
    mode: { type: String },
  }, // Proposed changes for update requests
});

const Business = mongoose.model("Business", BusinessSchema);
module.exports = Business;
