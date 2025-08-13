import express from 'express'
import { PlaceOrder, PlaceOrderRazorpay, PlaceOrderStripe, updateStatus, userOrders, allOrders } from '../controllers/orderController.js'
import adminAuth from './../middlewares/adminAuth.js';
import authUser from './../middlewares/auth.js';


const orderRouter = express.Router()

// Admin panel
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// Payment Features
orderRouter.post('/place', authUser, PlaceOrder)
orderRouter.post('/stripe', authUser, PlaceOrderStripe)
orderRouter.post('/razorpay', authUser, PlaceOrderRazorpay)

// User Features
orderRouter.post('/user-orders', authUser, userOrders)

export default orderRouter