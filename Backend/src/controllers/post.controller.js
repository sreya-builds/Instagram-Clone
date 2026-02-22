const postModel = require("../models/post.model")
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")
const likeModel = require("../models/like.model")
const mongoose = require("mongoose")

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})

/**
 * @function createPostController
 * @route   POST /api/posts
 * @desc    Create a new post with image upload using ImageKit
 * @access  Private (Authenticated user only)
 * @body    caption (optional), image (multipart/form-data)
 * @returns Newly created post object
 */


async function createPostController(req, res) {
    try {

        const uploadedFile = await imagekit.files.upload({
            file: await toFile(
                Buffer.from(req.file.buffer),
                req.file.originalname
            ),
            fileName: req.file.originalname,
            folder: "insta-clone-posts"
        })

        const post = await postModel.create({
            caption: req.body.caption,
            image_url: uploadedFile.url,
            user: req.user.id
        })

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: post
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        })
    }
}

/**
 * @function getSinglePostController
 * @route   GET /api/posts/:id
 * @desc    Fetch a single post by its ID
 * @access  Private
 * @param   id - MongoDB Post ObjectId
 * @returns Post details with populated user info
 */


async function getSinglePostController(req, res) {
    try {

        const postId = req.params.id

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID format"
            })
        }

        const post = await postModel
            .findById(postId)
            .populate("user", "username profilePic")

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Post found",
            data: post
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

/**
 * @function getAllPostsController
 * @route   GET /api/posts
 * @desc    Fetch all posts for feed sorted by newest first
 * @access  Private
 * @returns Array of posts with populated user details
 */



async function getAllPostsController(req, res) {
    try {

        const posts = await postModel
            .find()
            .populate("user", "username profilePic")
            .sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            message: "Feed fetched successfully",
            totalPosts: posts.length,
            data: posts
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}


/**
 * @function likePostController
 * @route   POST /api/posts/like/:postId
 * @desc    Like a post (creates a like record in database)
 * @access  Private
 * @param   postId - MongoDB Post ObjectId
 * @returns Like record for the post
 */


async function likePostController(req,res){
    const username = req.user.username
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if(!post){
        return res.status(404).json({
            message:"Post not found"
        })

        
    }
    const like = await likeModel.create({
           post : postId,
           user: username
 
        })

        res.status(200).json({
            message:"post liked successfully",
            like 
        })
}


/**
 * @function unlikePostController
 * @route   DELETE /api/posts/unlike/:postId
 * @desc    Remove like from a post (Unlike)
 * @access  Private
 * @param   postId - MongoDB Post ObjectId
 */


async function unlikePostController(req,res){
    const username = req.user.username
    const postId = req.params.postId

    const deletedLike = await likeModel.findOneAndDelete({
           post : postId,
           user: username
 
        })

        if(!deletedLike){
            return res.status(404).json({
                message:"You have not liked this post"
            })
        }

        res.status(200).json({
            message:"Post unliked successfully",
            unlike: deletedLike 
        })
}

module.exports = {
    createPostController,
    getSinglePostController,
    getAllPostsController,
    likePostController,
    unlikePostController
}
