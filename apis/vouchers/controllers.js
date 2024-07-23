const User = require("../../models/User");
const Voucher = require("../../models/Voucher");

//either all vouchers created by you // and // all vouchers sent to you
//i choose all vouchers sent to you

const getAllVouchers = async (req, res, next) => {
  //jwt strategy on route
  try {
    const user = await User.findById(req.user._id).populate("vouchers"); // check if true
    // const vouchers = await Voucher.find({ phoneNumber: user.phoneNumber }); //if token have phone number i only have to use req.user.phoneNumber and no need for const ABOVE!!!!!
    return res.status(200).json(user.vouchers);
  } catch (error) {
    next(error);
  }
}; //this function is for getting all vouchers created or sent?? or both??

const createVoucher = async (req, res, next) => {
  try {
    // take the phone number and see if there is a user with that number const userExist =  User.find({phoneNumber: req.body.phoneNumber})
    // User doesn't exist -> reject creating voucher
    // User exists -> check if user found is not the same as req.user._id
    // if they equal -> reject creating voucher (can not create a voucher for yourself)
    // if they are not equal -> send voucher

    const userReciever = await User.find({ phoneNumber: req.body.phoneNumber });
    const userSender = await User.find({ phoneNumber: req.user.phoneNumber }); //check with shahad phoneNumber regarding feild
    if (userReciever._id != userSender._id) {
      const newVoucher = await Voucher.create(req.body);
      // await Place.findByIdAndUpdate(req.body.place, {
      //   $push: { ratings: newRating },
      // });
      await User.findByIdAndUpdate(req.body.user, {
        $push: { vouchers: newVoucher },
      });

      // push the voucher to the user's list of vouchers
      return res.status(201).json(newVoucher);
    } else {
      return res.status(403).json({
        message: "There is no user with such phone number",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllVouchers, createVoucher };
