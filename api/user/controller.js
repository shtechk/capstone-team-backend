const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const Business = require("../../models/Business");
const TemporaryUser = require("../../models/TemporaryUser");
const { generateToken } = require("../../utils/jwt");
require("dotenv").config(); // Load environment variables

exports.register = async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      first_name,
      last_name,
      phone_number,
      isBusiness,
      business_name,
      business_time,
      business_date,
      business_location,
      business_description,
      business_mode,
    } = req.body;

    console.log("Registering user:", email);

    if (
      !username ||
      !password ||
      !email ||
      !first_name ||
      !last_name ||
      !phone_number
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profileImage =
      req.files && req.files.profile_image
        ? req.files.profile_image[0].path
        : null;
    const businessImage =
      req.files && req.files.business_image
        ? req.files.business_image[0].path
        : null;

    const verificationCode = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase();

    const tempUser = new TemporaryUser({
      username,
      password: hashedPassword,
      email: email.toLowerCase(),
      first_name,
      last_name,
      phone_number,
      profile_image: profileImage,
      verification_code: verificationCode,
      isBusiness: isBusiness === "true",
      businessDetails:
        isBusiness === "true"
          ? {
              name: business_name,
              time: business_time,
              date: business_date,
              location: business_location,
              description: business_description,
              image: businessImage,
              mode: business_mode,
            }
          : null,
    });

    await tempUser.save();
    console.log("Temporary user saved:", tempUser);

    // const transporter = nodemailer.createTransport({
    //   host: "smtp.mailtrap.io",
    //   port: 2525,
    //   auth: {
    //     user: process.env.MAILTRAP_USER,
    //     pass: process.env.MAILTRAP_PASS,
    //   },
    // });

    // const mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to: email,
    //   subject: "Email Verification",
    //   text: `Your verification code is ${verificationCode}`,
    // };

    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.error('Error sending email:', error);
    //     return res.status(500).json({ message: 'Failed to send verification email' });
    //   }
    //   console.log("Email sent: " + info.response);
    // });
    res.status(201).json({ message: "Verification code sent to email" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, verification_code } = req.body;

    console.log("Verifying email:", email);

    const tempUser = await TemporaryUser.findOne({
      email: email.toLowerCase(),
    });
    if (!tempUser) {
      console.log("User not found for email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Found temporary user:", tempUser);

    if (tempUser.verification_code !== verification_code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    const userRole = tempUser.isBusiness ? "business" : "user";
    const userStatus = tempUser.isBusiness ? "pending" : "active";

    const user = new User({
      username: tempUser.username,
      password: tempUser.password,
      email: tempUser.email,
      first_name: tempUser.first_name,
      last_name: tempUser.last_name,
      phone_number: tempUser.phone_number,
      profile_image: tempUser.profile_image,
      role: userRole,
      status: userStatus,
    });

    await user.save();
    console.log("User saved:", user);

    if (tempUser.isBusiness) {
      const business = new Business({
        owner_id: user._id,
        name: tempUser.businessDetails.name,
        time: tempUser.businessDetails.time,
        date: tempUser.businessDetails.date,
        location: tempUser.businessDetails.location,
        description: tempUser.businessDetails.description,
        image: tempUser.businessDetails.image,
        mode: tempUser.businessDetails.mode,
        status: "pending_creation",
      });

      await business.save();
      console.log("Business saved:", business);

      const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: "New Business Registration Request",
        text: `A new business registration request has been submitted by ${user.username}. Please review and approve or reject it.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }

    await TemporaryUser.deleteOne({ email: email.toLowerCase() });
    console.log("Temporary user deleted:", email);

    const token = generateToken(user._id, user.username, user.role);
    res.status(200).json({ token });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(402).json({ message: "Authentication failed" });
    }

    if (user.role === "business") {
      const business = await Business.findOne({ owner_id: user._id });

      if (business && business.status === "pending_creation") {
        return res.status(403).json({
          message: "Your business registration request is still under review.",
        });
      }
    }

    const token = generateToken(user._id, user.username, user.role);
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { username } = req.body;
  const image = req.file ? req.file.path : null;

  if (req.user.id !== req.params.id.toString()) {
    return res
      .status(401)
      .json({ message: "Unauthorized to update this user" });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (username) user.username = username;
    if (image) user.profile_image = image;
    await user.save();
    res.json({
      user: {
        username: user.username,
        image: user.profile_image,
        id: user._id,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.approveBusiness = async (req, res) => {
  try {
    const { status, rejection_reason } = req.body;
    const business = await Business.findById(req.params.id).populate(
      "owner_id"
    );

    if (!business) {
      return res
        .status(404)
        .json({ message: "Business registration not found" });
    }

    const user = business.owner_id;

    if (status === "approved") {
      business.status = "active";
      user.status = "active";
    } else if (status === "rejected") {
      business.status = "rejected_creation";
      business.rejection_reason = rejection_reason;
      user.status = "rejected";

      const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Business Registration Rejected",
        text: `Your business registration request has been rejected. Reason: ${rejection_reason}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }

    await business.save();
    await user.save();
    res
      .status(200)
      .json({ message: `Business registration ${status} successfully` });
  } catch (error) {
    console.error("Approve business error:", error);
    res.status(500).json({ message: error.message });
  }
};
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
