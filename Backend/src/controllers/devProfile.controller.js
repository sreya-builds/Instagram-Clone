const devProfileModel = require("../models/devProfile.model")

/* ================= CREATE DEV PROFILE ================= */

async function createDevProfileController(req, res) {

  const currentUserId = req.user.id

  const existingProfile = await devProfileModel.findOne({
    user: currentUserId
  })

  if (existingProfile) {
    return res.status(400).json({
      message: "Dev profile already exists"
    })
  }

  const devProfile = await devProfileModel.create({
    user: currentUserId,
    ...req.body   // 🔥 dynamic create
  })

  const populatedProfile = await devProfile.populate(
    "user",
    "username email profilePic"
  )

  res.status(201).json({
    message: "Dev profile created successfully",
    devProfile: populatedProfile
  })
}


/* ================= GET MY DEV PROFILE ================= */

async function getMyDevProfileController(req, res) {

  const currentUserId = req.user.id

  const profile = await devProfileModel
    .findOne({ user: currentUserId })
    .populate("user", "username email profilePic")

  if (!profile) {
    return res.status(404).json({
      message: "Dev profile not found"
    })
  }

  res.json({
    devProfile: profile
  })
}


/* ================= UPDATE DEV PROFILE ================= */

async function updateDevProfileController(req, res) {

  const currentUserId = req.user.id

  const updatedProfile = await devProfileModel
    .findOneAndUpdate(
      { user: currentUserId },
      { $set: req.body },   // 🔥 dynamic update
      { new: true, runValidators: true }
    )
    .populate("user", "username email profilePic")

  if (!updatedProfile) {
    return res.status(404).json({
      message: "Dev profile not found"
    })
  }

  res.json({
    message: "Dev profile updated successfully",
    devProfile: updatedProfile
  })
}

module.exports = {
  createDevProfileController,
  getMyDevProfileController,
  updateDevProfileController
}