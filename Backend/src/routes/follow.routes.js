const express = require("express")
const followController = require("../controllers/follow.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const followRouter = express.Router()

/**
 * @route   POST /api/follow/:username
 * @desc    Send follow request (status: pending)
 * @access  Private
 */

followRouter.post("/:username",authMiddleware,followController.sendFollowRequestController)

/**
 * @function acceptFollowRequestController
 * @route   PATCH /api/follow/accept/:followId
 * @desc    Accept a pending follow request by updating its status to "accepted"
 * @access  Private (Only the followee can accept the request)
 * @param   followId - MongoDB Follow Request ObjectId
 * @returns Updated follow request with status "accepted"
 */

followRouter.patch("/accept/:followId",authMiddleware,followController.acceptFollowRequestController)

/**
 * @route   PATCH /api/follow/reject/:followId
 * @desc    Reject a follow request
 * @access  Private (Only followee can reject)
 */

followRouter.patch("/reject/:followId",authMiddleware,followController.rejectFollowRequestController)

module.exports = followRouter