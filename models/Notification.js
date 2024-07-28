const { model, Schema } = require("mongoose");

const NotificationSchema = new Schema({
  message: { type: String, required: true },
  isNonSeen: { type: Boolean, default: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});
module.exports = model("Notification", NotificationSchema);
