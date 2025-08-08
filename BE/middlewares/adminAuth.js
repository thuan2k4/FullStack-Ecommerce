import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next) => {
    try {
        const header = req.headers.authorization
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized! Token missing"
            })
        }
        const token = header.split(" ")[1]
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        if (token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({
                success: false,
                message: "Not Authorized!"
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export default adminAuth