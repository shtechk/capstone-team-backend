const mongoose = require("mongoose");

const VoucherSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  phoneNumber: { type: Number, required: true },
  message: { type: String },
  method: { type: String, required: true },
  status: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Voucher", VoucherSchema);
