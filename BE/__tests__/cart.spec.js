// Mock các dependencies
jest.mock('../models/userModel.js', () => ({
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
}))

jest.mock('../models/productModel.js', () => ({
    findById: jest.fn()
}))

jest.mock('../swagger/swagger.js', () => ({
    __esModule: true,
    default: jest.fn()
}))

jest.mock('jsonwebtoken')

import request from 'supertest'
import app from '../app.js'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import productModel from '../models/productModel.js'


afterEach(async () => {
    jest.clearAllMocks()
})


describe('Cart Controller Tests', () => {
    const mockUserId = 'user123'
    const mockItemId = 'item123'

    const mockProduct = {
        _id: mockItemId,
        name: 'Test Product'
    }

    const mockUser = {
        _id: mockUserId,
        cartData: {}
    }

    const mockUserWithCart = {
        ...mockUser,
        cartData: {
            [mockItemId]: { M: 1 }
        }
    }
    beforeEach(() => {
        jwt.verify.mockImplementation(() => ({ id: mockUserId }))
    })

    describe('Add to Cart', () => {
        it('should add item to cart successfully', async () => {
            productModel.findById.mockResolvedValue(mockProduct)
            userModel.findById.mockResolvedValue(mockUser)
            userModel.findByIdAndUpdate.mockResolvedValue(mockUser)

            const res = await request(app)
                .post('/api/cart/add-cart')
                .set('Authorization', 'Bearer fake_token')
                .send({
                    itemId: mockItemId,
                    size: 'M'
                })

            expect(res.status).toBe(200)
            expect(res.body).toEqual({
                success: true,
                message: 'Item added to cart!'
            })
            expect(userModel.findByIdAndUpdate).toHaveBeenCalled()
        })

        it('should return 400 when itemId or size missing', async () => {
            const res = await request(app)
                .post('/api/cart/add-cart')
                .set('Authorization', 'Bearer fake_token')
                .send({})
            expect(res.status).toBe(400)
        })

        it('should return 404 when product & user not found', async () => {
            productModel.findById.mockResolvedValue(null)
            userModel.findById.mockResolvedValue(null)

            const res = await request(app)
                .post('/api/cart/add-cart')
                .set('Authorization', 'Bearer fake_token')
                .send({
                    itemId: 'invalid_id',
                    size: 'M'
                })

            expect(res.status).toBe(404)
            expect(productModel.findById).toHaveBeenCalledWith('invalid_id')
            expect(userModel.findById).not.toHaveBeenCalled()
        })
    })

    describe('Get User Cart', () => {
        it('should get cart data successfully', async () => {
            userModel.findById.mockResolvedValue(mockUserWithCart)

            const res = await request(app)
                .get('/api/cart/get-cart')
                .set('Authorization', 'Bearer fake_token')

            expect(res.status).toBe(200)
            expect(res.body).toEqual({
                success: true,
                cartData: mockUserWithCart.cartData
            })
        })
        it('should return 404 when user not found', async () => {
            userModel.findById.mockResolvedValue(false)

            const res = await request(app)
                .get('/api/cart/get-cart')
                .set('Authorization', 'Bearer fake_token')

            expect(res.status).toBe(404)
            expect(res.body).toEqual({
                success: false,
                message: "User not found!"
            })
        })
    })

    describe('Update Cart', () => {
        it('should update cart quantity successfully', async () => {
            productModel.findById.mockResolvedValue(mockProduct)
            userModel.findById.mockResolvedValue(mockUser)
            userModel.findByIdAndUpdate.mockResolvedValue(mockUser) //Update cart data

            const res = await request(app)
                .put('/api/cart/update-cart')
                .set('Authorization', 'Bearer fake_token')
                .send({
                    itemId: mockItemId,
                    size: 'M',
                    quantity: 2
                })

            expect(res.status).toBe(200)
            expect(res.body).toEqual({
                success: true,
                message: 'Cart updated!'
            })
            expect(userModel.findByIdAndUpdate).toHaveBeenCalled()
        })

        it('should remove item when quantity is 0', async () => {
            productModel.findById.mockResolvedValue(mockItemId)
            userModel.findById.mockResolvedValue(mockUserWithCart)
            userModel.findByIdAndUpdate.mockResolvedValue(mockUserWithCart)

            const res = await request(app)
                .put('/api/cart/update-cart')
                .set('Authorization', 'Bearer fake_token')
                .send({
                    itemId: mockItemId,
                    size: 'M',
                    quantity: 0
                })

            expect(res.status).toBe(200)
            expect(res.body).toEqual({
                success: true,
                message: 'Cart updated!'
            })
        })

        it('should return 400 when missing required fields', async () => {
            const res = await request(app)
                .put('/api/cart/update-cart')
                .set('Authorization', 'Bearer fake_token')
                .send({})
            expect(res.status).toBe(400)
        })

        it('should return 404 when product & user not found', async () => {
            productModel.findById.mockResolvedValue(null)
            userModel.findById.mockResolvedValue(null)

            const res = await request(app)
                .put('/api/cart/update-cart')
                .set('Authorization', 'Bearer fake_token')
                .send({
                    itemId: 'invalid_id',
                    size: 'M',
                    quantity: 1
                })

            expect(res.status).toBe(404)
            expect(productModel.findById).toHaveBeenCalledWith('invalid_id')
            expect(userModel.findById).not.toHaveBeenCalled()
        })
    })

    describe('Remove Cart', () => {
        it('should remove item from cart successfully', async () => {

            productModel.findById.mockResolvedValue(mockItemId)
            userModel.findById.mockResolvedValue(mockUserWithCart)
            userModel.findByIdAndUpdate.mockResolvedValue(mockUserWithCart)

            const res = await request(app)
                .delete('/api/cart/remove-cart')
                .set('Authorization', 'Bearer fake_token')
                .send({
                    itemId: mockItemId
                })

            expect(res.status).toBe(200)
            expect(res.body).toEqual({
                success: true,
                message: 'Cart removed!'
            })
            expect(userModel.findByIdAndUpdate).toHaveBeenCalled()
        })

        it('should return 400 when itemId and userId missing', async () => {
            const res = await request(app)
                .delete('/api/cart/remove-cart')
                .set('Authorization', 'Bearer fake_token')
                .send({})
            expect(res.status).toBe(400)
        })

        it('should return 404 when product and user not found', async () => {
            productModel.findById.mockResolvedValue(null)
            userModel.findById.mockResolvedValue(null)

            const res = await request(app)
                .delete('/api/cart/remove-cart')
                .set('Authorization', 'Bearer fake_token')
                .send({
                    itemId: 'invalid_id'
                })

            expect(res.status).toBe(404)
            expect(productModel.findById).toHaveBeenCalledWith('invalid_id')
            expect(userModel.findById).not.toHaveBeenCalled()
        })
    })
})