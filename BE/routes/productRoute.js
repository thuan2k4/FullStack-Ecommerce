import express from 'express'
import { addProduct, listProduct, removeProduct, singleProduct } from '../controllers/productController.js'
import upload from '../middlewares/multer.js'
import adminAuth from '../middlewares/adminAuth.js'
const productRouter = express.Router()

productRouter.post(
    '/add-product',
    adminAuth,
    upload.fields([
        {
            name: 'image1',
            maxCount: 1
        },
        {
            name: 'image2',
            maxCount: 1
        },
        {
            name: 'image3',
            maxCount: 1
        },
        {
            name: 'image4',
            maxCount: 1
        },
    ]),
    addProduct
)
productRouter.get('/list-product', adminAuth, listProduct)
productRouter.post('/remove-product', adminAuth, removeProduct)
productRouter.post('/single-product', adminAuth, singleProduct)

export default productRouter