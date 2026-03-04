const followModel = require("../models/follow.model")
const userModel = require("../models/user.model")

async function getUserProfileController(req, res) {

  const username = req.params.username

  const user = await userModel
    .findOne({ username })
    .select("-password")

  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  const followers = await followModel
    .find({ followee: user._id, status: "accepted" })
    .populate("follower", "username profilePic")

  const following = await followModel
    .find({ follower: user._id, status: "accepted" })
    .populate("followee", "username profilePic")

  res.json({
    user,
    totalFollowers: followers.length,
    totalFollowing: following.length
  })
}


/* ================= FOLLOW USER ================= */

async function followUserController(req, res) {

  const currentUserId = req.user.id
  const username = req.params.username

  const targetUser = await userModel.findOne({ username })

  if (!targetUser) {
    return res.status(404).json({ message: "User not found" })
  }

  if (targetUser._id.toString() === currentUserId) {
    return res.status(400).json({ message: "You cannot follow yourself" })
  }

  const existingFollow = await followModel.findOne({
    follower: currentUserId,
    followee: targetUser._id
  })

  if (existingFollow) {
    return res.status(400).json({ message: "Already following this user" })
  }

  await followModel.create({
    follower: currentUserId,
    followee: targetUser._id,
    status: "accepted"
  })

  res.json({ message: "Followed successfully" })
}


/* ================= UNFOLLOW USER ================= */

async function unfollowUserController(req, res) {

  const currentUserId = req.user.id
  const username = req.params.username

  const targetUser = await userModel.findOne({ username })

  if (!targetUser) {
    return res.status(404).json({ message: "User not found" })
  }

  const follow = await followModel.findOne({
    follower: currentUserId,
    followee: targetUser._id
  })

  if (!follow) {
    return res.status(400).json({ message: "You are not following this user" })
  }

  await followModel.findOneAndDelete({
    follower: currentUserId,
    followee: targetUser._id
  })

  res.json({ message: "Unfollowed successfully" })
}


/* ================= UPDATE PROFILE ================= */

async function updateProfileController(req, res) {

  const currentUserId = req.user.id
  const { bio, profilePic } = req.body

  const updatedUser = await userModel.findByIdAndUpdate(
    currentUserId,
    { bio, profilePic },
    { new: true }
  ).select("-password")

  res.json({
    message: "Profile updated",
    user: updatedUser
  })
}


/* ================= GET FOLLOWERS ================= */

async function getFollowersController(req, res) {

  const username = req.params.username

  const user = await userModel.findOne({ username })

  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  const followers = await followModel
    .find({ followee: user._id, status: "accepted" })
    .populate("follower", "username profilePic")

  res.json({
    followers: followers.map(f => f.follower)
  })
}


/* ================= GET FOLLOWING ================= */

async function getFollowingController(req, res) {

  const username = req.params.username

  const user = await userModel.findOne({ username })

  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  const following = await followModel
    .find({ follower: user._id, status: "accepted" })
    .populate("followee", "username profilePic")

  res.json({
    following: following.map(f => f.followee)
  })
}


module.exports = {
  getUserProfileController,
  followUserController,
  unfollowUserController,
  updateProfileController,
  getFollowersController,
  getFollowingController
}