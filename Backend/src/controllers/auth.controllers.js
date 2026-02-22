const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

async function registerController (req,res) {
    const { username, email, password, profilePic, bio } = req.body

    const isUserAlreadyExists = await userModel.findOne({
        $or:[
            { username },
            { email }
        ]
    })

    if(isUserAlreadyExists){
        return res.status(409).json({
            message: "user already exist " + 
            (isUserAlreadyExists.email === email 
                ? "Email already exist" 
                : "Username already exist")
        })
    }

    // ✅ bcrypt hash
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        profilePic,
        bio,
        password: hashedPassword
    })

    const token = jwt.sign(
        { id: user._id,
            username:user.username
         },
        process.env.JWT_SECRET,
        { expiresIn: "2d" }
    )

    res.cookie("token", token)

    res.status(201).json({
        message: "user register successfully",
        user: {
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic
        }
    })
}



async function loginController (req,res) {
    const { username, email, password } = req.body

    const user = await userModel.findOne({
        $or:[
            { username: username },
            { email: email }
        ]
    })

    if(!user){
        return res.status(404).json({
            message: "user not found"
        })
    }

    // ✅ bcrypt compare
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(401).json({
            message : "password invalid"
        })
    }

    const token = jwt.sign(
        { id: user._id ,
            username:user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    )

    res.cookie("token", token)

    res.status(200).json({
        message: "User loginIn Successfully",
        user: {
            username: user.username,
            email: user.email,
            bio: user.bio,
            profilePic: user.profilePic
        }
    })
}

module.exports = {
    registerController,
    loginController
}
