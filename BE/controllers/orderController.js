import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'

const PlaceOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            status: "Pending",
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(
            userId,
            { cartData: {} }
        )

        res.json({
            success: true,
            message: "Order Placed"
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

const PlaceOrderStripe = async (req, res) => {

}

const PlaceOrderRazorpay = async (req, res) => {

}

// crawl all order for admin
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})

        res.json({
            success: true,
            orders: orders
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

// for client
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body
        const orderDetail = await orderModel.find({ userId: userId })

        res.json({
            success: true,
            orderDetail: orderDetail
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

// update order detail for admin panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({
            success: true,
            message: "Status Updated!"
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

export { PlaceOrder, PlaceOrderRazorpay, PlaceOrderStripe, updateStatus, userOrders, allOrders }