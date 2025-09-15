import userModel from "../models/userModel.js"
import productModel from './../models/productModel.js';

const addToCart = async (req, res) => {
    try {
        const userId = req.userId
        const { itemId, size } = req.body

        if (!itemId || !size) {
            return res.status(400).json({
                success: false,
                message: "itemId and size are required!"
            })
        }

        const productItem = await productModel.findById(itemId)
        if (!productItem) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            })
        }

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            })
        }

        let cartData = userData.cartData || {}

        if (cartData[itemId]) {
            cartData[itemId][size] = (cartData[itemId][size] || 0) + 1
        } else {
            cartData[itemId] = { [size]: 1 }
        }

        await userModel.findByIdAndUpdate(userId, { cartData }, { new: true })

        res.status(200).json({
            success: true,
            message: "Item added to cart!"
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateCart = async (req, res) => {
    try {
        const userId = req.userId
        const { itemId, size, quantity } = req.body

        if (!userId || !itemId || !size || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: "userId, itemId, size and quantity are required!"
            })
        }

        const productItem = await productModel.findById(itemId)
        if (!productItem) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            })
        }

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            })
        }


        let cartData = userData.cartData || {}

        if (!cartData[itemId]) {
            cartData[itemId] = {}
        }

        if (quantity <= 0) {
            if (cartData[itemId] && cartData[itemId][size] !== undefined) {
                delete cartData[itemId]
            }
        }
        else {
            cartData[itemId][size] = quantity
        }

        await userModel.findByIdAndUpdate(userId, { cartData }, { new: true })

        res.status(200).json({
            success: true,
            message: "Cart updated!"
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getUserCart = async (req, res) => {
    try {
        const userId = req.userId

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            })
        }

        res.status(200).json({
            success: true,
            cartData: userData.cartData || {}
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
const removeCart = async (req, res) => {
    try {
        const userId = req.userId
        const { itemId } = req.body

        if (!userId || !itemId) {
            return res.status(400).json({
                success: false,
                message: "userId and itemId are required!"
            })
        }

        const productItem = await productModel.findById(itemId)
        if (!productItem) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            })
        }

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            })
        }

        let cartData = userData.cartData
        if (!cartData) {
            return res.status(400).json({
                success: false,
                message: "Cart not found!"
            })
        }
        delete cartData[itemId]
        await userModel.findByIdAndUpdate(userId, { cartData }, { new: true })

        res.status(200).json({
            success: true,
            message: "Cart removed!"
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}
export { addToCart, updateCart, getUserCart, removeCart }