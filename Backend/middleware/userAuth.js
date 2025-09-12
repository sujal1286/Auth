import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const userAuth = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecode.id) {
            req.userId = tokenDecode.id;
            // attach user object for convenience
            const user = await userModel.findById(tokenDecode.id).select('-password');
            req.user = user;
            next();
        } else {
            return res.status(401).json({ message: "Unauthorized" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};




