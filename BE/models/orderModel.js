import { mongoose } from 'mongoose';
/**
 * @swagger
 * components:
 *   schemas:
 *     Orders:
 *       type: object
 *       required:
 *         - userId
 *         - items
 *         - amount
 *         - address
 *         - status
 *         - paymentMethod
 *         - payment
 *         - date
 *       properties:
 *         userId:
 *           type: string
 *         items:
 *           type: string
 *         amount:
 *           type: integer
 *         address:
 *           type: string
 *         status:
 *           type: string
 *         paymentMethod:
 *           type: string
 *         payment:
 *           type: string
 *         date:
 *           type: date-time
 */
const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: '' },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Date, default: Date.now }
})

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)
export default orderModel