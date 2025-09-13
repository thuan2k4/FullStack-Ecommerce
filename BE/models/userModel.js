import mongoose from "mongoose";
/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         email: "qthuan1234@gmail.com"
 *         password: "123456789"
 */
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
}, { minimize: false }) // minimize hold empty obj

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel