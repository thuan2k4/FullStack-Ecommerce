import express from 'express'
import { addToCart, updateCart, getUserCart } from "../controllers/cartController.js"
import authUser from '../middlewares/auth.js'

const cartRouter = express.Router()

cartRouter.post("/add-cart", authUser, addToCart)
cartRouter.post("/update-cart", authUser, updateCart)
cartRouter.post("/get-cart", authUser, getUserCart)

export default cartRouter