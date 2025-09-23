// Mock các dependencies
jest.mock('../models/userModel.js', () => ({
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
}))

jest.mock('../models/productModel.js', () => {
    const mockProductModel = jest.fn().mockImplementation((data) => ({
        ...data,
        save: jest.fn().mockResolvedValue(data)
    }));

    mockProductModel.findById = jest.fn();
    mockProductModel.find = jest.fn();
    mockProductModel.deleteOne = jest.fn();

    return {
        __esModule: true,
        default: mockProductModel
    }
})

jest.mock('../swagger/swagger.js', () => ({
    __esModule: true,
    default: jest.fn()
}))

jest.mock('jsonwebtoken')

jest.mock('cloudinary', () => ({
    v2: {
        uploader: {
            upload: jest.fn().mockResolvedValue({ secure_url: 'test-url' })
        }
    }
}))

import request from 'supertest'
import app from '../app.js'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import productModel from '../models/productModel.js'

afterEach(async () => {
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

describe('Product Controller Tests', () => {
    const mockProductId = 'product123'
    const mockProduct = {
        _id: mockProductId,
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        category: 'Test Category',
        sizes: ['S', 'M', 'L'],
        image: ['test-image-url'],
        date: Date.now()
    }

    const mockImageBuffer = Buffer.from('fake image data')
    beforeEach(() => {
        // Mock JWT verify để return đúng format admin authentication
        jwt.verify.mockImplementation(() => ({
            id: 'admin123',
            email: process.env.ADMIN_EMAIL,
            isAdmin: true
        }))
    })

    describe('Admin Authentication', () => {
        it('should return 403 when not admin', async () => {
            jwt.verify.mockImplementation(() => ({
                id: 'user123',
                email: 'user@test.com',
                isAdmin: false
            }))

            const res = await request(app)
                .post('/api/product/add-product')
                .set('Authorization', 'Bearer fake_token')
                .field('name', 'Test Product')
                .field('description', 'Test Description')
                .field('price', '100')
                .field('category', 'Test Category')
                .field('sizes', JSON.stringify(['S', 'M', 'L']))

            expect(res.status).toBe(403)
        })
    })

    describe('Add Product', () => {
        it('should add product successfully', async () => {
            const res = await request(app)
                .post('/api/product/add-product')
                .set('Authorization', `Bearer admin_token`)
                .field('name', 'Test Product')
                .field('description', 'Test Description')
                .field('price', '100')
                .field('category', 'Test Category')
                .field('sizes', JSON.stringify(['S', 'M', 'L']))
                .attach('images', mockImageBuffer, {
                    filename: 'test.jpg',
                    contentType: 'image/jpeg'
                })

            expect(res.status).toBe(201)
            expect(res.body).toEqual({
                success: true,
                message: 'Product added successfully!'
            })

        })

        it('should return 400 when required fields missing', async () => {
            const res = await request(app)
                .post('/api/product/add-product')
                .set('Authorization', `Bearer admin_token`)
                .send({})

            expect(res.status).toBe(400)
            expect(res.body).toEqual({
                success: false,
                message: 'Missing required fields!'
            })
        })
    })

    describe('List Products', () => {
        it('should list all products successfully', async () => {
            productModel.find.mockResolvedValue([mockProduct])

            const res = await request(app)
                .get('/api/product/list-product')

            expect(res.status).toBe(200)
            expect(res.body).toEqual({
                success: true,
                products: [mockProduct]
            })
        })
    })

    describe('Remove Product', () => {
        it('should remove product successfully', async () => {
            productModel.findById.mockResolvedValue(mockProduct)
            productModel.deleteOne.mockResolvedValue({})

            const res = await request(app)
                .delete('/api/product/remove-product')
                .set('Authorization', `Bearer admin_token`)
                .send({ productId: mockProductId })

            expect(res.status).toBe(200)
            expect(res.body).toEqual({
                success: true,
                message: 'Product removed successfully!'
            })
        })

        it('should return 404 when product not found', async () => {
            productModel.findById.mockResolvedValue(null)

            const res = await request(app)
                .delete('/api/product/remove-product')
                .set('Authorization', `Bearer admin_token`)
                .send({ productId: 'invalid_id' })

            expect(res.status).toBe(404)
            expect(res.body).toEqual({
                success: false,
                message: 'Product not found!'
            })
        })
    })

    describe('Single Product', () => {
        it('should get single product successfully', async () => {
            productModel.findById.mockResolvedValue(mockProduct)

            const res = await request(app)
                .post('/api/product/single-product')
                .set('Authorization', `Bearer admin_token`)
                .send({ productId: mockProductId })

            expect(res.status).toBe(200)
            expect(res.body).toEqual({
                success: true,
                information: mockProduct
            })
        })

        it('should return 404 when product not found', async () => {
            productModel.findById.mockResolvedValue(null)

            const res = await request(app)
                .post('/api/product/single-product')
                .set('Authorization', `Bearer admin_token`)
                .send({ productId: 'invalid_id' })

            expect(res.status).toBe(404)
            expect(res.body).toEqual({
                success: false,
                message: 'Product not found!'
            })
        })
    })
})