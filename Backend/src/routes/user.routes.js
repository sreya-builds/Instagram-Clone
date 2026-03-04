const express = require("express");
const userController = require("../controllers/user.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

const userRouter = express.Router();

/* Follow */
userRouter.post("/follow/:username", authMiddleware, userController.followUserController);

/* Unfollow */
userRouter.post("/unfollow/:username", authMiddleware, userController.unfollowUserController);

/* Update Profile */
userRouter.patch("/edit", authMiddleware, userController.updateProfileController);

/* Get Followers */
userRouter.get("/:username/followers", authMiddleware, userController.getFollowersController);

/* Get Following */
userRouter.get("/:username/following", authMiddleware, userController.getFollowingController);

/* Get User Profile */
userRouter.get("/:username", authMiddleware, userController.getUserProfileController);

module.exports = userRouter