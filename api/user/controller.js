const User = require("../../models/User");
const Business = require("../../models/Business");
const TemporaryUser = require("../../models/TemporaryUser");
const { generateToken } = require("../../utils/jwt");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

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
      email,
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

    const transporter = nodemailer.createTransport({
      service: "Outlook365",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      text: `Your verification code is ${verificationCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Email sent: " + info.response);
    });

    res.status(201).json({ message: "Verification code sent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, verification_code } = req.body;

    const tempUser = await TemporaryUser.findOne({ email });
    if (!tempUser) {
      return res.status(404).json({ message: "User not found" });
    }

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

      const transporter = nodemailer.createTransport({
        service: "Outlook365",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
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
          return console.log(error);
        }
        console.log("Email sent: " + info.response);
      });
    }

    await TemporaryUser.deleteOne({ email });

    const token = generateToken(user._id, user.username, user.role);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Other existing functions...

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    const token = generateToken(user._id, user.username, user.role);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
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
    if (image) user.profile_image = image; // Ensure the image field is updated correctly
    await user.save();
    res.json({
      user: {
        username: user.username,
        image: user.profile_image, // Return the updated image
        id: user._id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Approve or reject business registration
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

      // Send rejection email to business user
      const transporter = nodemailer.createTransport({
        service: "Outlook365",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
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
          return console.log(error);
        }
        console.log("Email sent: " + info.response);
      });
    }

    await business.save();
    await user.save();
    res
      .status(200)
      .json({ message: `Business registration ${status} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
