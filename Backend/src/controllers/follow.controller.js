const followModel = require("../models/follow.model")
const userModel = require("../models/user.model")

/**
 * SEND FOLLOW REQUEST
 */
const sendFollowRequestController = async (req, res) => {

  const followerId = req.user.id
  const { followeeId } = req.params

  // Cannot follow yourself
  if (followerId === followeeId) {
    return res.status(400).json({ message: "You cannot follow yourself" })
  }

  // Check if user exists
  const followeeUser = await userModel.findById(followeeId)
  if (!followeeUser) {
    return res.status(404).json({ message: "User not found" })
  }

  // Check if request already exists
  const existingRequest = await followModel.findOne({
    follower: followerId,
    followee: followeeId
  })

  if (existingRequest) {
    return res.status(400).json({ message: "Request already exists" })
  }

  // Create request
  const newRequest = await followModel.create({
    follower: followerId,
    followee: followeeId,
    status: "pending"
  })

  // Populate before sending response
  const populatedRequest = await followModel
    .findById(newRequest._id)
    .populate("follower", "username profilePic")
    .populate("followee", "username profilePic")

  res.status(201).json(populatedRequest)
}


/**
 * ACCEPT FOLLOW REQUEST
 */
const acceptFollowRequestController = async (req, res) => {

  const { requestId } = req.params

  const request = await followModel.findById(requestId)

  console.log("Logged in user:", req.user.id)
  console.log("Followee id:", request?.followee?.toString())

  if (!request) {
    return res.status(404).json({ message: "Request not found" })
  }

  if (request.followee.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" })
  }

  if (request.status === "accepted") {
    return res.status(400).json({ message: "Already accepted" })
  }

  request.status = "accepted"
  await request.save()

  await userModel.findByIdAndUpdate(request.followee, {
    $addToSet: { followers: request.follower }
  })

  await userModel.findByIdAndUpdate(request.follower, {
    $addToSet: { following: request.followee }
  })

  res.json({ message: "Follow request accepted successfully" })
}

/**
 * REJECT FOLLOW REQUEST
 */
const rejectFollowRequestController = async (req, res) => {

  const { requestId } = req.params

  const request = await followModel.findById(requestId)

  if (!request) {
    return res.status(404).json({ message: "Request not found" })
  }

  if (request.followee.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" })
  }

  request.status = "rejected"
  await request.save()

  const populatedRequest = await followModel
    .findById(request._id)
    .populate("follower", "username profilePic")
    .populate("followee", "username profilePic")

  res.json({
    message: "Follow request rejected",
    data: populatedRequest
  })
}


module.exports = {
  sendFollowRequestController,
  acceptFollowRequestController,
  rejectFollowRequestController
}