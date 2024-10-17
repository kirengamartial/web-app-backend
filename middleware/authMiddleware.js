import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

const authCheck = async(req, res, next) => {
    const token = req.cookies.jwt

    if(token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET)
            req.user = await User.findById(decoded.userId).select('-password')
            next()
        } catch (error) {
            res.status(400).json({message: "Invalid Token"})
        }
    }else {
        res.status(500).json({message: "There is no token"})
    }
}


export default authCheck