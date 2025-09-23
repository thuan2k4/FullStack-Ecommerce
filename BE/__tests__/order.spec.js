

// Mock các dependencies
jest.mock('../models/orderModel.js', () => {
    const mockOrderModel = jest.fn().mockImplementation((data) => ({
        ...data,
        _id: 'mock_order_id',
        save: jest.fn().mockResolvedValue(data)
    }))

    mockOrderModel.find = jest.fn()
    mockOrderModel.findById = jest.fn()
    mockOrderModel.findByIdAndUpdate = jest.fn()
    mockOrderModel.findByIdAndDelete = jest.fn()

    return {
        __esModule: true,
        default: mockOrderModel
    }
})

jest.mock('../models/userModel.js', () => ({
    findByIdAndUpdate: jest.fn()
}))

jest.mock('../swagger/swagger.js', () => ({
    __esModule: true,
    default: jest.fn()
}))

jest.mock('jsonwebtoken')

import userModel from '../models/userModel.js'
import orderModel from '../models/orderModel.js'
import request from 'supertest'
import app from '../app.js'
import jwt from 'jsonwebtoken'

afterEach(() => {
    jest.clearAllMocks()
})



beforeAll(() => {
    process.env.ADMIN_EMAIL = 'admin@test.com'
    process.env.ADMIN_PASSWORD = 'admin123'
    process.env.JWT_SECRET = 'test_secret'
})

afterAll(() => {
    delete process.env.ADMIN_EMAIL
    delete process.env.ADMIN_PASSWORD
    delete process.env.JWT_SECRET
})

describe('Order Controller Tests', () => {
    const mockUserId = 'user123'
    const mockOrderId = 'order123'

    const mockOrder = {
        userId: mockUserId,
        items: [
            {
                name: 'Test Product',
                price: 100,
                quantity: 2
            }
        ],
        amount: 210,
        address: 'Test Address',
        status: 'Pending',
        paymentMethod: 'COD',
        payment: false
    }
    beforeEach(() => {
        jwt.verify.mockImplementation(() => ({
            id: mockUserId,
            isAdmin: false
        }))
    })

    describe('Place Order (COD)', () => {
        it('should place order successfully', async () => {
            const res = await request(app)
                .post('/api/order/place')
                .set('Authorization', 'Bearer fake_token')
                .send(mockOrder)

            expect(res.status).toBe(201)
            expect(res.body).toEqual({
                success: true,
                message: 'Order placed successfully!'
            })
            expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
                mockUserId,
                { cartData: {} }
            )
        })

        it('should return 400 when required fields missing', async () => {
            const res = await request(app)
                .post('/api/order/place')
                .set('Authorization', 'Bearer fake_token')
                .send({})
            expect(res.status).toBe(400)
        })
    })

    describe('User Orders', () => {
        it('should get user orders successfully', async () => {
            orderModel.find.mockResolvedValue([mockOrder])

            const res = await request(app)
                .get('/api/order/user-orders')
                .set('Authorization', 'Bearer fake_token')

            expect(res.status).toBe(200)
            expect(res.body).toEqual({
                success: true,
                orderDetail: [mockOrder]
            })
            expect(orderModel.find).toHaveBeenCalledWith({ userId: mockUserId })
        })
    })

    describe('Admin Orders Management', () => {
        beforeEach(() => {
            // Mock admin authentication
            jwt.verify.mockImplementation(() => ({
                id: 'admin123',
                email: process.env.ADMIN_EMAIL,
                isAdmin: true
            }))
        })

        it('should get all orders successfully', async () => {
            const mockOrders = [mockOrder]
            orderModel.find.mockResolvedValue(mockOrders)

            const res = await request(app)
                .get('/api/order/list')
                .set('Authorization', 'Bearer fake_admin_token')

            expect(res.status).toBe(200)
            expect(res.body).toEqual({
                success: true,
                orders: mockOrders
            })
        })

        it('should update order status successfully', async () => {
            orderModel.findByIdAndUpdate.mockResolvedValue({
                ...mockOrder,
                status: 'Delivered'
            })

            const res = await request(app)
                .put('/api/order/status')
                .set('Authorization', 'Bearer fake_admin_token')
                .send({
                    orderId: mockOrderId,
                    status: 'Delivered'
                })

            expect(res.status).toBe(200)
            expect(res.body).toEqual({
                success: true,
                message: 'Status updated successfully!'
            })
        })

        it('should return 400 when status update missing fields', async () => {
            const res = await request(app)
                .put('/api/order/status')
                .set('Authorization', 'Bearer fake_admin_token')
                .send({})

            expect(res.status).toBe(400)
        })

        it('should return 403 when non-admin tries to get all orders', async () => {
            jwt.verify.mockImplementation(() => ({
                id: mockUserId,
                isAdmin: false
            }))

            const res = await request(app)
                .get('/api/order/list')
                .set('Authorization', 'Bearer fake_token')

            expect(res.status).toBe(403)
        })
        it('should return 403 when non-admin tries to update order', async () => {
            jwt.verify.mockImplementation(() => ({
                id: mockUserId,
                isAdmin: false
            }))

            const res = await request(app)
                .put('/api/order/status')
                .set('Authorization', 'Bearer fake_token')

            expect(res.status).toBe(403)
        })
    })
})