const express = require("express");
const postController = require("../controllers/post.controller")

const postRouter = express.Router();

const multer = require("multer")
const upload = multer({storage:multer.memoryStorage()})
const authMiddleware = require("../middlewares/auth.middleware")

/**
 * @route   POST /api/posts
 * @desc    Create a new post with image upload
 * @access  Private (Authenticated users only)
 * @body    image (multipart/form-data), caption (optional)
 */

postRouter.post("/",upload.single("image"),authMiddleware ,postController.createPostController)

/**
 * @route   GET /api/posts
 * @desc    Get all posts (Feed)
 * @access  Private
 */
postRouter.get("/",authMiddleware, postController.getAllPostsController)
/**
 * @route   GET /api/posts/:id
 * @desc    Get a single post by ID
 * @access  Private
 * @param   id - Post ID
 */
postRouter.get("/:id",authMiddleware, postController.getSinglePostController)

/**
 * @function likePostController
 * @route   POST /api/posts/like/:postId
 * @desc    Like a post by creating a like record
 * @access  Private (Authenticated users only)
 * @param   postId - MongoDB Post ObjectId
 * @returns Like record of the user for the post
 */


postRouter.post("/like/:postId",authMiddleware,postController.likePostController)

/**
 * @function unlikePostController
 * @route   DELETE /api/posts/unlike/:postId
 * @desc    Unlike a post by removing the existing like record
 * @access  Private (Authenticated users only)
 * @param   postId - MongoDB Post ObjectId
 * @returns Deleted like record
 */

postRouter.delete("/unlike/:postId",authMiddleware,postController.unlikePostController)


 

module.exports = postRouter;
