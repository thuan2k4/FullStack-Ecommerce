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
const filterProduct = async (req, res) => {
    try {
        const { category, subCategory, sort, page = 1, limit = 10 } = req.query
        let filterCriteria = {}

        // Xử lý filter theo category
        if (category) {
            const categories = category.split(',')
            filterCriteria.category = { $in: categories }
        }

        // Xử lý filter theo subCategory
        if (subCategory) {
            const subcategories = subCategory.split(',')
            filterCriteria.subCategory = { $in: subcategories }
        }
        const total = await productModel.countDocuments(filterCriteria)
        const skip = (page - 1) * limit

        // Thực hiện query với các điều kiện filter
        const products = await productModel.find(filterCriteria)
            .sort(sort === 'low-high' ? { price: 1 } : sort === 'high-low' ? { price: -1 } : {})
            .limit(Number(limit))
            .skip(skip)

        res.status(200).json({
            success: true,
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            products
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export { addProduct, listProduct, removeProduct, singleProduct, filterProduct }