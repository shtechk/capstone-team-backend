const Business = require("../../models/Business");
const User = require("../../models/User");

// Fetch business details by ID
exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }
    res.status(200).json(business);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit a business registration request
exports.submitBusinessRegistration = async (req, res) => {
  if (req.user.role !== "business") {
    return res
      .status(403)
      .json({ message: "Only business users can register a business" });
  }

  try {
    const business = new Business({
      owner_id: req.user._id, // Assuming the user is authenticated
      name: req.body.name,
      time: req.body.time,
      date: req.body.date,
      location: req.body.location,
      description: req.body.description,
      image: req.body.image,
      mode: req.body.mode,
      status: "pending_creation", // Set status to pending_creation
    });
    await business.save();
    res.status(201).json({
      message: "Business registration request submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error submitting business registration request",
      error,
    });
  }
};

// Approve or reject business registration request
exports.approveOrRejectBusinessRegistration = async (req, res) => {
  try {
    const { status, rejection_reason } = req.body;
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res
        .status(404)
        .json({ message: "Business registration request not found" });
    }

    if (status === "rejected_creation" || status === "rejected_update") {
      business.status = status;
      business.rejection_reason = rejection_reason;
    } else if (status === "approved") {
      business.status = "active"; // Directly set the status to 'active' when approved
      if (business.status === "pending_update") {
        // Apply the proposed changes if it's an update request
        business.name = business.proposed_changes.name || business.name;
        business.time = business.proposed_changes.time || business.time;
        business.date = business.proposed_changes.date || business.date;
        business.location =
          business.proposed_changes.location || business.location;
        business.description =
          business.proposed_changes.description || business.description;
        business.image = business.proposed_changes.image || business.image;
        business.mode = business.proposed_changes.mode || business.mode;
        business.proposed_changes = {}; // Clear proposed changes after approval
      }
    }

    await business.save();
    res.status(200).json({
      message: `Business registration request ${status} successfully`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error processing business registration request",
      error,
    });
  }
};

// Submit a business update request
exports.submitBusinessUpdate = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    business.proposed_changes = {
      name: req.body.name,
      time: req.body.time,
      date: req.body.date,
      location: req.body.location,
      description: req.body.description,
      image: req.body.image,
      mode: req.body.mode,
    };
    business.status = "pending_update";
    await business.save();

    res
      .status(200)
      .json({ message: "Business update request submitted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting business update request", error });
  }
};

// Fetch all business requests
exports.getAllBusinessRequests = async (req, res) => {
  try {
    const businesses = await Business.find({
      status: { $in: ["pending_creation", "pending_update"] },
    });
    res.status(200).json(businesses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching business requests", error });
  }
};
