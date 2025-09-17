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
 *         - images
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
 *           example: 299
 *         images:
 *           type: array
 *           description: Max image are 10.
 *           maxItems: 10
 *           items:
 *             type: string
 *             format: binary
 *         category:
 *           type: string
 *           enum: [Topwear, Bottomwear, Outerwear]
 *           example: "Topwear"
 *         subCategory:
 *           type: string
 *           enum: [Men, Women, Kids]
 *           example: "Men"
 *         sizes:
 *           type: array
 *           description: Size are [S, M, L, XL, XXL]
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
    image: { type: [String], required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: {
        type: Array,
        required: true,
        validate: {
            validator: function (v) {
                return v.every(size => ['S', 'M', 'L', 'XL', 'XXL'].includes(size))
            },
            message: props => `${props.value} contains invalid sizes. Valid sizes are S, M, L, XL, XXL`
        }
    },
    bestseller: { type: Boolean, default: false },
    date: { type: Date, required: true },
})

const productModel = mongoose.models.product || mongoose.model("product", productSchema)

export default productModel