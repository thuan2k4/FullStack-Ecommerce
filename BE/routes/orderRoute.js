import express from 'express'
import { PlaceOrder, PlaceOrderStripe, updateStatus, userOrders, allOrders, verifyStripe } from '../controllers/orderController.js'
import adminAuth from './../middlewares/adminAuth.js';
import authUser from './../middlewares/auth.js';


const orderRouter = express.Router()

// Admin panel
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// Payment Features
orderRouter.post('/place', authUser, PlaceOrder)
orderRouter.post('/stripe', authUser, PlaceOrderStripe)


// User Features
orderRouter.post('/user-orders', authUser, userOrders)

// verify payment
orderRouter.post('/verify-Stripe', authUser, verifyStripe)
export default orderRouter