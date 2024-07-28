const User = require("../../models/User");
const Voucher = require("../../models/Voucher");

//this page is done

//either all vouchers created by you // and // all vouchers sent to you
//i choose all vouchers sent to you

const getAllVouchers = async (req, res, next) => {
  //jwt strategy on route
  try {
    const user = await User.findById(req.user._id).populate("voucher"); // check if true
    // const vouchers = await Voucher.find({ phoneNumber: user.phoneNumber }); //if token have phone number i only have to use req.user.phoneNumber and no need for const ABOVE!!!!!
    return res.status(200).json(user.voucher);
  } catch (error) {
    next(error);
  }
}; //this function is for getting all vouchers created or sent?? or both??

const getVoucherById = async (req, res, next) => {
  try {
    const voucherId = req.params.voucherId;
    const voucher = await Voucher.findById(voucherId);
    if (!voucher) {
      return res.status(404).json(" No voucher found :( ");
    } else {
      return res.status(200).json(voucher);
    }
  } catch (error) {
    next(error);
  }
};

const createVoucher = async (req, res, next) => {
  try {
    // take the phone number and see if there is a user with that number const userExist =  User.find({phoneNumber: req.body.phoneNumber})
    // User doesn't exist -> reject creating voucher
    // User exists -> check if user found is not the same as req.user._id
    // if they equal -> reject creating voucher (can not create a voucher for yourself)
    // if they are not equal -> send voucher
    console.log("create VOucher", req.body);
    const userReciever = await User.findOne({
      phone_number: req.body.phone_number,
    });

    console.log("userReciver", userReciever);
    const userSender = await User.findOne({
      phone_number: req.user.phone_number,
    }); //check with shahad phoneNumber regarding feild

    console.log("userSender", userSender);
    const senderID = userSender._id;
    const recieverID = userReciever._id;
    console.log(senderID);
    if (senderID.toString() !== recieverID.toString()) {
      const newVoucher = await Voucher.create(req.body);
      // await Place.findByIdAndUpdate(req.body.place, {
      //   $push: { ratings: newRating },
      // });
      await userReciever.updateOne({
        $push: { voucher: newVoucher },
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

module.exports = { getAllVouchers, getVoucherById, createVoucher };
