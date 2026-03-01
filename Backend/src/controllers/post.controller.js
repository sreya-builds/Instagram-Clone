const postModel = require("../models/post.model")
const likeModel = require("../models/like.model")
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

/**
 * CREATE POST
 */
async function createPostController(req, res) {
  try {
    const userId = req.user.id
    const caption = req.body.caption || ""

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required to create a post."
      })
    }

    const file = await imagekit.files.upload({
      file: await toFile(Buffer.from(req.file.buffer), "file"),
      fileName: `post-${Date.now()}`,
      folder: "cohort-2-insta-clone-posts"
    })

    const post = await postModel.create({
      caption,
      image_url: file.url,
      user: userId
    })

    return res.status(201).json({
      message: "Post created successfully.",
      post
    })

  } catch (error) {
    return res.status(500).json({
      message: "Error creating post",
      error: error.message
    })
  }
}


/**
 * GET MY POSTS
 */
async function getPostController(req, res) {
  try {
    const userId = req.user.id

    const posts = await postModel.find({ user: userId })

    return res.status(200).json({
      message: "Posts fetched successfully.",
      totalPosts: posts.length,
      posts
    })

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching posts",
      error: error.message
    })
  }
}


/**
 * GET POST DETAILS
 */
async function getPostDetailsController(req, res) {
  try {
    const userId = req.user.id
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if (!post) {
      return res.status(404).json({
        message: "Post not found."
      })
    }

    if (post.user.toString() !== userId) {
      return res.status(403).json({
        message: "Forbidden content."
      })
    }

    return res.status(200).json({
      message: "Post fetched successfully.",
      post
    })

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching post",
      error: error.message
    })
  }
}


/**
 * LIKE POST
 */
async function likePostController(req, res) {
  try {
    const userId = req.user.id
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if (!post) {
      return res.status(404).json({
        message: "Post not found."
      })
    }

    const alreadyLiked = await likeModel.findOne({
      post: postId,
      user: userId
    })

    if (alreadyLiked) {
      return res.status(400).json({
        message: "Post already liked."
      })
    }

    const like = await likeModel.create({
      post: postId,
      user: userId
    })

    return res.status(200).json({
      message: "Post liked successfully.",
      like
    })

  } catch (error) {
    return res.status(500).json({
      message: "Error liking post",
      error: error.message
    })
  }
}


/**
 * UNLIKE POST
 */
async function unLikePostController(req, res) {
  try {
    const userId = req.user.id
    const postId = req.params.postId

    const isLiked = await likeModel.findOne({
      post: postId,
      user: userId
    })

    if (!isLiked) {
      return res.status(400).json({
        message: "Post not liked yet."
      })
    }

    await likeModel.findByIdAndDelete(isLiked._id)

    return res.status(200).json({
      message: "Post unliked successfully."
    })

  } catch (error) {
    return res.status(500).json({
      message: "Error unliking post",
      error: error.message
    })
  }
}


/**
 * GET FEED (All Posts)
 */
async function getFeedController(req, res) {
  try {
    const userId = req.user.id

    const posts = await postModel.find({})
      .populate("user", "username profilePic")

    const formattedPosts = await Promise.all(
      posts.map(async (post) => {

        const isLiked = await likeModel.findOne({
          user: userId,
          post: post._id
        })

        return {
          ...post.toObject(),
          isLiked: Boolean(isLiked)
        }
      })
    )

    return res.status(200).json({
      message: "Feed fetched successfully.",
      totalPosts: formattedPosts.length,
      posts: formattedPosts
    })

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching feed",
      error: error.message
    })
  }
}


module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController,
  likePostController,
  unLikePostController,
  getFeedController
}