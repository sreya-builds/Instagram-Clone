const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      maxlength: 500,
      default: "",
    },

    image_url: {
      type: String,
      required: [true,"imgUrl is required for creating a post"]
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user id is required to creating a post"]
    },
  },
  {
    timestamps: true, 
  }
);
 

const postModel = mongoose.model("Post", postSchema);
module.exports = postModel
