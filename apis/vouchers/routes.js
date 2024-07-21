const express = require("express");

const voucherRouter = express.Router();

voucherRouter.get("/", getAllVouchers);
voucherRouter.post("/", createVoucher);

module.exports = voucherRouter;
