const express = require("express");
const userController = require("../controllers/user.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

const userRouter = express.Router();

/**
 * @route   GET /api/users/:username
 * @desc    Get user profile by username
 * @access  Private
 */
userRouter.get("/:username", authMiddleware, userController.getUserProfileController);

/**
 * @route   POST /api/users/follow/:username
 * @desc    Follow a user
 * @access  Private
 */
userRouter.post("/follow/:username", authMiddleware, userController.followUserController);

/**
 * @route   POST /api/users/unfollow/:username
 * @desc    Unfollow a user
 * @access  Private
 */
userRouter.post("/unfollow/:username", authMiddleware, userController.unfollowUserController);

/**
 * @route   PATCH /api/users/edit
 * @desc    Update logged-in user's profile
 * @access  Private
 */
userRouter.patch("/edit", authMiddleware, userController.updateProfileController);

/**
 * @route   GET /api/users/:username/followers
 * @desc    Get followers list
 * @access  Private
 */
userRouter.get("/:username/followers", authMiddleware, userController.getFollowersController);

/**
 * @route   GET /api/users/:username/following
 * @desc    Get following list
 * @access  Private
 */
userRouter.get("/:username/following", authMiddleware, userController.getFollowingController);

module.exports = userRouter