const express = require("express");
const { getAllVouchers, createVoucher } = require("./controllers");

const voucherRouter = express.Router();

voucherRouter.get("/", getAllVouchers);
voucherRouter.post("/", createVoucher);

module.exports = voucherRouter;
