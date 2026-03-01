const followModel = require("../models/follow.model")
const userModel = require("../models/user.model")

// SEND FOLLOW REQUEST
const sendFollowRequestController = async (req, res) => {

  const followerId = req.user.id
  const { followeeId } = req.params

  if (followerId === followeeId) {
    return res.status(400).json({ message: "You cannot follow yourself" })
  }

  const existingRequest = await followModel.findOne({
    follower: followerId,
    followee: followeeId
  })

  if (existingRequest) {
    return res.status(400).json({ message: "Request already exists" })
  }

  const newRequest = await followModel.create({
    follower: followerId,
    followee: followeeId,
    status: "pending"
  })

  res.status(201).json(newRequest)
}


// ACCEPT REQUEST
const acceptFollowRequestController = async (req, res) => {

  const { requestId } = req.params

  const request = await followModel.findById(requestId)

  if (!request) {
    return res.status(404).json({ message: "Request not found" })
  }

  if (request.followee.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" })
  }

  request.status = "accepted"
  await request.save()

  await userModel.findByIdAndUpdate(request.followee, {
    $addToSet: { followers: request.follower }
  })

  await userModel.findByIdAndUpdate(request.follower, {
    $addToSet: { following: request.followee }
  })

  res.json({ message: "Follow request accepted" })
}


// REJECT REQUEST
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

  res.json({ message: "Follow request rejected" })
}


module.exports = {
  sendFollowRequestController,
  acceptFollowRequestController,
  rejectFollowRequestController
}