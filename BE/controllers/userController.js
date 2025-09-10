import validator from 'validator'
import userModel from '../models/userModel.js';
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User doesn't exists!"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect, try again!"
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: Number(process.env.TOKEN_EXPIRE),
            }
        )

        res.status(200).json({
            success: true,
            token,
            message: "Login successfully!"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const existsUser = await userModel.findOne({ email })
        if (existsUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists!"
            })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email!"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Please enter a strong password!"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        await newUser.save()

        res.status(201).json({
            success: true,
            message: "Register successfully!"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const adminEmail = process.env.ADMIN_EMAIL || ""
        const adminPassword = process.env.ADMIN_PASSWORD || ""

        if (email === adminEmail && password === adminPassword) {
            const token = jwt.sign(
                { email: adminEmail },
                process.env.JWT_SECRET,
                {
                    expiresIn: Number(process.env.TOKEN_EXPIRE),
                }
            )

            res.status(200).json({
                success: true,
                token
            })
        } else {
            res.status(401).json({
                success: false,
                message: "Invalid email or password, try again!"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export { loginUser, registerUser, adminLogin }