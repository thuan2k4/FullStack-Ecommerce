import validator from 'validator'
import userModel from '../models/userModel.js';
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({
                success: false,
                message: "User doesn't exists!"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Password is incorrect, try again!"
            })
        }

        const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email
        },
            process.env.JWT_SECRET,
            {
                expiresIn: Number(process.env.TOKEN_EXPIRE),
            }
        )
        res.json({
            success: true,
            token: token,
            message: "Login successfully!"
        })

    } catch (error) {
        console.log(error)
    }
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const existsUser = await userModel.findOne({ email })
        if (existsUser) {
            return res.json({
                success: false,
                message: "User already exists!"
            })
        }

        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Please enter a valid email!"
            })
        }

        if (password.length < 6) {
            return res.json({
                success: false,
                message: "Please enter a strong password!"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        })

        const user = await newUser.save()

        res.json({
            success: true,
            message: "Register successfully!"
        })

    } catch (error) {
        console.log(error)
        res.json({
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

            const token = jwt.sign({
                email: adminEmail
            },
                process.env.JWT_SECRET,
                {
                    expiresIn: Number(process.env.TOKEN_EXPIRE),
                })
            res.json({
                success: true,
                token: token
            })
        }
        else {
            res.json({
                success: false,
                message: "Invalid email or password, try again!"
            })
        }
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

export { loginUser, registerUser, adminLogin }