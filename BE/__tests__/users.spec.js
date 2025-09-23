jest.mock('../models/userModel.js', () => {
    const find = jest.fn()

    const mockUser = jest.fn().mockImplementation((data) => {
        return {
            ...data,
            save: jest.fn().mockResolvedValue({
                _id: 'mock_id',
                ...data
            })
        }
    })
    mockUser.findOne = find

    return {
        __esModule: true,
        default: mockUser
    }
})
jest.mock('../swagger/swagger.js', () => ({
    __esModule: true,
    default: jest.fn()
}))

jest.mock('bcrypt')
jest.mock('jsonwebtoken')

// import { connect, clear, close } from '../utils/setUpDbTest.js'
import request from 'supertest'
import app from '../app.js'
import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

afterEach(async () => {
    jest.clearAllMocks()
})

describe('User register', () => {
    const mockUser = {
        name: "test",
        email: "testing@domain.com",
        password: "123456"
    }

    it('Create user successfully', async () => {
        userModel.findOne.mockResolvedValue(null)

        const res = await request(app)
            .post('/api/user/register')
            .send(mockUser)

        expect(res.statusCode).toBe(201)
        expect(res.body).toHaveProperty('success', true)
        expect(userModel).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'test',
                email: 'testing@domain.com'
            })
        )
    })

    it('User already exists', async () => {
        userModel.findOne.mockResolvedValue(true)
        const res = await request(app)
            .post('/api/user/register')
            .send(mockUser)
        expect(res.statusCode).toBe(409);
        expect(res.body).toHaveProperty('success', false);
    })

    it('Invalid email & Weak Password', async () => {
        userModel.findOne.mockResolvedValue(null)
        mockUser.password = "1" // weak password
        mockUser.email = "abc" // invalid email

        const res = await request(app)
            .post('/api/user/register')
            .send(mockUser)
        expect(res.statusCode).toBe(400)
        expect(res.body).toHaveProperty('success', false)
    })

})


describe('User login', () => {
    const mockUser = {
        email: "testing@domain.com",
        password: "123456"
    }
    it('Login successfully', async () => {
        userModel.findOne.mockResolvedValue({
            _id: 'mock_id',
            name: 'tester',
            email: 'testing@domain.com',
            password: 'hashed_pw'
        })
        bcrypt.compare.mockResolvedValue(true)
        jwt.sign.mockReturnValue("mock_token")

        const res = await request(app)
            .post('/api/user/login')
            .send(mockUser)

        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('success', true)
        expect(res.body).toHaveProperty('token', 'mock_token')

        expect(userModel.findOne).toHaveBeenCalledWith({ email: mockUser.email })
        expect(bcrypt.compare).toHaveBeenCalledWith('123456', 'hashed_pw')
        expect(jwt.sign).toHaveBeenCalled()
    })
})