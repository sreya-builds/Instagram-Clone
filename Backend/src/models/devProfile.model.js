const mongoose = require("mongoose")

const devProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 300
    },

    techStack: [
      {
        name: { type: String, trim: true },
        level: { 
          type: String, 
          enum: ["Beginner", "Intermediate", "Advanced"] 
        }
      }
    ],

    github: {
      username: String,
      profileUrl: String,
      followers: Number,
      publicRepos: Number,
      contributionStreak: Number
    },

    leetCode: {
      username: String,
      problemsSolved: Number,
      ranking: Number
    },

    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    },

    availabilityStatus: {
      type: String,
      enum: ["Open to Work", "Open to Collaboration", "Not Available"],
      default: "Open to Collaboration"
    },

    totalProjects: {
      type: Number,
      default: 0
    },

    badges: [String] 
  },
  { timestamps: true }
)

module.exports = mongoose.model("DevProfile", devProfileSchema)