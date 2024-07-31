const { model, Schema } = require("mongoose");

const NotificationSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
module.exports = model("Notification", NotificationSchema);
