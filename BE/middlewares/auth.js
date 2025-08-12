import jwt from 'jsonwebtoken'

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
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(token_decode)
        req.body.userId = token_decode.id

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
    }
}

export default authUser