import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const adminCheck = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            const decoded = jwt.verify(token, process.env.SECRET);
            
            req.user = await User.findById(decoded.userId).select('-password');
            
            if (req.user && req.user.isAdmin) {
                next();
            } else {
                res.status(403).json({ message: "Not authorized as admin" });
            }
            
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Invalid token" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

export default adminCheck;