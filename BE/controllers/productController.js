
import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"

const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' })
                return result.secure_url
            })
        )

        const productData = {
            name: name,
            description: description,
            price: Number(price),
            category: category,
            subCategory: subCategory,
            sizes: JSON.parse(sizes),
            bestseller: bestseller === 'true' ? true : false,
            image: imagesUrl,
            date: Date.now()
        }
        console.log(productData);
        const product = new productModel(productData)
        await product.save()


        res.json({
            success: true,
            message: "Product Add!",
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({})
        res.json({
            success: true,
            products: products
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const removeProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const productItem = await productModel.findOne({ _id: productId })

        if (!productItem) {
            res.json({
                success: false,
                message: "Could not find Product, try again!"
            })
        }

        await productModel.deleteOne(productItem)
        res.json({
            success: true,
            message: "Product Removed!"
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const productItem = await productModel.findOne({ _id: productId })

        if (!productItem) {
            res.json({
                success: false,
                message: "Could not find Product, try again!"
            })
        }
        res.json({
            success: true,
            infomation: productItem
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

export { addProduct, listProduct, removeProduct, singleProduct }