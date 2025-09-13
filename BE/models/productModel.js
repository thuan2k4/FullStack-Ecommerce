import mongoose from "mongoose";
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - image
 *         - category
 *         - subCategory
 *         - sizes
 *       properties:
 *         name:
 *           type: string
 *           example: "T-Shirt"
 *         description:
 *           type: string
 *           example: "High quality cotton T-shirt"
 *         price:
 *           type: number
 *           example: 299000
 *         image:
 *           type: array
 *           items:
 *             type: string
 *             example: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
 *         category:
 *           type: string
 *           example: "Clothing"
 *         subCategory:
 *           type: string
 *           example: "Men"
 *         sizes:
 *           type: array
 *           items:
 *             type: string
 *           example: ["S", "M", "L"]
 *         bestseller:
 *           type: boolean
 *           example: true
 */
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: Array, required: true },
    bestseller: { type: Boolean },
    date: { type: Date, required: true },
})

const productModel = mongoose.models.product || mongoose.model("product", productSchema)

export default productModel