const followModel = require("../models/follow.model")
const userModel = require("../models/user.model")


async function sendFollowRequestController(req, res) {

  const follower = req.user.username;
  const followee = req.params.username;

  if (follower === followee) {
    return res.status(400).json({
      message: "You cannot follow yourself"
    });
  }

  const userExists = await userModel.findOne({ username: followee });

  if (!userExists) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  const existingFollow = await followModel.findOne({
    follower,
    followee
  });

  if (existingFollow) {
    return res.status(400).json({
      message: "Follow request already exists"
    });
  }

  // Create request
  const follow = await followModel.create({
    follower,
    followee,
    status: "pending"
  });

  return res.status(201).json({
    message: "Follow request sent successfully",
    follow
  });
}

async function acceptFollowRequestController(req, res) {

  const followId = req.params.followId;

  const follow = await followModel.findById(followId);

  if (!follow) {
    return res.status(404).json({
      message: "Follow request not found"
    });
  }

  // Only followee can accept
  if (follow.followee !== req.user.username) {
    return res.status(403).json({
      message: "You are not allowed to accept this request"
    });
  }

  if (follow.status === "accepted") {
    return res.status(400).json({
      message: "Follow request already accepted"
    });
  }

  follow.status = "accepted";
  await follow.save();

  return res.status(200).json({
    message: "Follow request accepted successfully",
    follow
  });
}

async function rejectFollowRequestController(req, res) {

  const followId = req.params.followId;

  const follow = await followModel.findById(followId);

  if (!follow) {
    return res.status(404).json({
      message: "Follow request not found"
    });
  }

  if (follow.followee !== req.user.username) {
    return res.status(403).json({
      message: "Not allowed"
    });
  }

  if (follow.status !== "pending") {
    return res.status(400).json({
      message: `Follow request already ${follow.status}`
    });
  }

  follow.status = "rejected";
  await follow.save();

  return res.status(200).json({
    message: "Follow request rejected successfully"
  });
}



module.exports = {
  sendFollowRequestController,
  acceptFollowRequestController,
  rejectFollowRequestController
};
