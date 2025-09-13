import express from 'express'
import { PlaceOrder, PlaceOrderStripe, updateStatus, userOrders, allOrders, verifyStripe } from '../controllers/orderController.js'
import adminAuth from './../middlewares/adminAuth.js';
import authUser from './../middlewares/auth.js';


const orderRouter = express.Router()

// Admin panel
orderRouter.get('/list', adminAuth, allOrders)
orderRouter.put('/status', adminAuth, updateStatus)

// Payment Features
orderRouter.post('/place', authUser, PlaceOrder)
orderRouter.post('/stripe', authUser, PlaceOrderStripe)

// User Features
orderRouter.get('/user-orders', authUser, userOrders)

// verify payment
orderRouter.post('/verify-Stripe', authUser, verifyStripe)
export default orderRouter