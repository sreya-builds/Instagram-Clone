const express = require("express");
const devProfileController = require("../controllers/devProfile.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const devRouter = express.Router();

/* Create Dev Profile */
devRouter.post("/create", authMiddleware, devProfileController.createDevProfileController);

/* Get My Dev Profile */
devRouter.get("/me", authMiddleware, devProfileController.getMyDevProfileController);

/* Update Dev Profile */
devRouter.patch("/edit", authMiddleware, devProfileController.updateDevProfileController);

module.exports = devRouter