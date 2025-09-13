import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'
import Stripe from 'stripe'

const currency = 'inr'
const deliveryCharge = 10

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const PlaceOrder = async (req, res) => {
    try {
        const userId = req.userId
        const { items, amount, address } = req.body

        if (!items?.length || !amount || !address) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields!"
            })
        }

        const orderData = {
            userId,
            items,
            address,
            amount,
            status: "Pending",
            paymentMethod: "COD",
            payment: false,
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        res.status(201).json({
            success: true,
            message: "Order placed successfully!"
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const PlaceOrderStripe = async (req, res) => {
    try {
        const userId = req.userId
        const { items, amount, address } = req.body
        const { origin } = req.headers

        if (!items?.length || !amount || !address) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields!"
            })
        }

        const orderData = {
            userId,
            items,
            address,
            amount,
            status: "Pending",
            paymentMethod: "Stripe",
            payment: false,
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item) => ({
            price_data: {
                currency,
                product_data: { name: item.name },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency,
                product_data: { name: 'Delivery Charges' },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.status(200).json({
            success: true,
            session_url: session.url
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true })
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
            return res.status(200).json({ success: true })
        } else {
            await orderModel.findByIdAndDelete(orderId)
            return res.status(400).json({ success: false, message: "Payment failed, order removed!" })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.status(200).json({
            success: true,
            orders
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const userOrders = async (req, res) => {
    try {
        const userId = req.userId
        const orderDetail = await orderModel.find({ userId })

        res.status(200).json({
            success: true,
            orderDetail
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body

        if (!orderId || !status) {
            return res.status(400).json({
                success: false,
                message: "Order ID and status are required!"
            })
        }

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.status(200).json({
            success: true,
            message: "Status updated successfully!"
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export { PlaceOrder, PlaceOrderStripe, updateStatus, userOrders, allOrders, verifyStripe }