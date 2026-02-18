const express = require("express")
const userController = require("../controllers/user.controllers")
const authMiddleware = require("../middlewares/auth.middleware")
const userRouter = express.Router()

/**
 * @route   POST /api/users/follow/:userid
 * @desc    Follow a user
 * @access  Private
 */
userRouter.post("/follow/:username",authMiddleware,userController.followUserController)
/**
 * @route   POST /api/users/unfollow/:userid
 * @desc    Unfollow a user
 * @access  Private
 */
userRouter.post("/unfollow/:username",authMiddleware,userController.unfollowUserController)
module.exports = userRouter