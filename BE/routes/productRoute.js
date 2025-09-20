import express from 'express'
import { addProduct, listProduct, removeProduct, singleProduct, filterProduct } from '../controllers/productController.js'
import upload from '../middlewares/multer.js'
import adminAuth from '../middlewares/adminAuth.js'
const productRouter = express.Router()

productRouter.post('/add-product', adminAuth, upload.array('images', 10), addProduct)
productRouter.get('/list-product', listProduct)
productRouter.delete('/remove-product', adminAuth, removeProduct)
productRouter.post('/single-product', adminAuth, singleProduct)
productRouter.get('/filter', filterProduct)

export default productRouter