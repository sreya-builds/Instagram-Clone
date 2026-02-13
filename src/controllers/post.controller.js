const postModel = require("../models/post.model")
const jwt = require("jsonwebtoken")
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")
const mongoose = require("mongoose")

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

async function createPostController(req, res) {

    try {

        console.log(req.body, req.file)

        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                message: "Token not provided, Unauthorized access"
            })
        }

        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!req.file) {
            return res.status(400).json({
                message: "Image is required"
            })
        }

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
            user: decoded.id
        })

        res.status(201).json({
            message: "Post created successfully",
            post
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
}
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


module.exports = {
    createPostController,
    getSinglePostController
}
