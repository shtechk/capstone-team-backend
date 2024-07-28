const express = require("express");
const {
  getAllVouchers,
  createVoucher,
  getVoucherById,
} = require("./controllers");
const passport = require("passport");
const { ensureAuthenticated } = require("../../middlewares/auth");

//why do we use jwt strategy on the route?? what is it supposed to do ?

const voucherRouter = express.Router();

voucherRouter.get("/allVouchers", ensureAuthenticated, getAllVouchers);
voucherRouter.get("/:voucherId", ensureAuthenticated, getVoucherById);
voucherRouter.post("/createVoucher", ensureAuthenticated, createVoucher);

module.exports = voucherRouter;
