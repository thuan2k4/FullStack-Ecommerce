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

jest.mock('jsonwebtoken')

// import { connect, clear, close } from '../utils/setUpDbTest.js'
import request from 'supertest'
import app from '../app.js'
import jwt from 'jsonwebtoken'

afterEach(async () => {
    jest.clearAllMocks()
})

describe('Admin', () => {
    beforeAll(() => {
        process.env.ADMIN_EMAIL = 'admin@domain.com'
        process.env.ADMIN_PASSWORD = '123456'
        process.env.JWT_SECRET = 'test_secret'
        process.env.TOKEN_EXPIRE = '3600'
    })
    const mockAdmin = {
        email: 'admin@domain.com',
        password: '123456'
    }
    it('Login successfully', async () => {
        jwt.sign.mockReturnValue("mock_token")

        const res = await request(app)
            .post('/api/user/admin')
            .send(mockAdmin)

        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('success', true)
        expect(res.body).toHaveProperty('token', 'mock_token')
        expect(jwt.sign).toHaveBeenCalled()
    })
})