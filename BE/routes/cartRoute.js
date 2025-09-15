import express from 'express'
import { addToCart, updateCart, getUserCart, removeCart } from "../controllers/cartController.js"
import authUser from '../middlewares/auth.js'

const cartRouter = express.Router()

cartRouter.post("/add-cart", authUser, addToCart)
cartRouter.put("/update-cart", authUser, updateCart)
cartRouter.get("/get-cart", authUser, getUserCart)
cartRouter.delete("/remove-cart", authUser, removeCart)

export default cartRouter