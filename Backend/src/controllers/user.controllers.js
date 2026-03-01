const followModel = require("../models/follow.model")
const userModel = require("../models/user.model")


/*getUserProfileController*/
async function getUserProfileController(req, res) {

  const username = req.params.username

  const user = await userModel
    .findOne({ username })
    .select("-password")
    .populate("followers", "username profilePic")
    .populate("following", "username profilePic")

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    })
  }

  res.json({
    user,
    totalFollowers: user.followers.length,
    totalFollowing: user.following.length
  })

}
  /*followUserController*/
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

  const currentUser = await userModel.findById(currentUserId)

  if (currentUser.following.includes(targetUser._id)) {
    return res.status(400).json({ message: "Already following this user" })
  }

  currentUser.following.push(targetUser._id)
  targetUser.followers.push(currentUser._id)

  await currentUser.save()
  await targetUser.save()

  res.json({ message: "Followed successfully" })
}

/*unfollowUser*/
async function unfollowUserController(req, res) {

  const currentUserId = req.user.id
  const username = req.params.username

  const targetUser = await userModel.findOne({ username })

  if (!targetUser) {
    return res.status(404).json({ message: "User not found" })
  }

  const currentUser = await userModel.findById(currentUserId)

  if (!currentUser.following.includes(targetUser._id)) {
    return res.status(400).json({ message: "You are not following this user" })
  }

  currentUser.following = currentUser.following.filter(
    id => id.toString() !== targetUser._id.toString()
  )

  targetUser.followers = targetUser.followers.filter(
    id => id.toString() !== currentUserId
  )

  await currentUser.save()
  await targetUser.save()

  res.json({ message: "Unfollowed successfully" })
}

/*updateProfile*/

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
 
/*getFollower*/
async function getFollowersController(req, res) {

  const username = req.params.username

  const user = await userModel
    .findOne({ username })
    .populate("followers", "username profilePic")

  res.json({
    followers: user.followers
  })
}


/*getFollowing*/

async function getFollowingController(req, res) {

  const username = req.params.username

  const user = await userModel
    .findOne({ username })
    .populate("following", "username profilePic")

  res.json({
    following: user.following
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