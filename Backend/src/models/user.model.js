const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: [true, "username already exists"]
    },

    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email already exist"]
    },

    password: {
      type: String,
      required: [true, "password is required"]
    },

    profilePic: {
      type: String,
      default:"https://ik.imagekit.io/hc2c5agno/download.png"
    },

    bio: {
      type: String
    },
    followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
  })

const userModel = mongoose.model("User", userSchema)

module.exports = userModel
