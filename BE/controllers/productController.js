import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"

const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body
        const images = req.files

        let parsedSizes = []
        if (Array.isArray(sizes)) {
            parsedSizes = sizes
        } else if (typeof sizes === 'string') {
            try {
                const tmp = JSON.parse(sizes)
                if (Array.isArray(tmp)) parsedSizes = tmp
                else if (typeof tmp === 'string') parsedSizes = tmp.split(',').map(s => s.trim()).filter(Boolean)
                else parsedSizes = [String(tmp)]
            } catch (err) {
                parsedSizes = sizes.split(',').map(s => s.trim()).filter(Boolean)
            }
        }
        if (!name || !description || !price || !category || !sizes || !images?.length) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields!"
            })
        }

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' })
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            sizes: parsedSizes,
            bestseller: bestseller === 'true',
            image: imagesUrl,
            date: Date.now()
        }

        const product = new productModel(productData)
        await product.save()

        res.status(201).json({
            success: true,
            message: "Product added successfully!"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({})
        res.status(200).json({
            success: true,
            products
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const removeProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const productItem = await productModel.findById(productId)

        if (!productItem) {
            return res.status(404).json({
                success: false,
                message: "Product not found!"
            })
        }

        await productModel.deleteOne({ _id: productId })
        res.status(200).json({
            success: true,
            message: "Product removed successfully!"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const productItem = await productModel.findById(productId)

        if (!productItem) {
            return res.status(404).json({
                success: false,
                message: "Product not found!"
            })
        }
        res.status(200).json({
            success: true,
            information: productItem
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export { addProduct, listProduct, removeProduct, singleProduct }