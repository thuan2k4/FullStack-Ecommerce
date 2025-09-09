import jwt from 'jsonwebtoken'
import 'dotenv/config'

const authUser = async (req, res, next) => {
    try {
        const header = req.headers.authorization
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized! Token missing"
            })
        }
        const token = header.split(" ")[1]
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token is required'
            })
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: 'Server configuration error: JWT_SECRET is missing'
            });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET)

        req.userId = token_decode.id

        let exp = token_decode.exp
        let now = Math.floor(Date.now() / 1000)

        if (now >= exp) {
            return res.status(401).json({
                success: false,
                message: "The token has expired."
            })
        }
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            success: false,
            message: error.name === 'JsonWebTokenError'
                ? 'Invalid token'
                : 'Authentication error'
        })
    }
}

export default authUser