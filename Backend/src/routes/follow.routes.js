const express = require("express")
const followController = require("../controllers/follow.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const followRouter = express.Router()

// SEND FOLLOW REQUEST
// controller expects: followeeId

followRouter.post("/:followeeId",authMiddleware,followController.sendFollowRequestController)


// ACCEPT FOLLOW REQUEST
// controller expects: requestId

followRouter.patch("/accept/:requestId",authMiddleware,followController.acceptFollowRequestController)


// REJECT FOLLOW REQUEST
// controller expects: requestId

followRouter.patch("/reject/:requestId",authMiddleware,followController.rejectFollowRequestController)

module.exports = followRouter