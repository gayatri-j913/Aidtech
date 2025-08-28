const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = async (req, res, next) => {
    try {
        const token =await req.cookies?.refreshToken ||  req.header('Authorization')?.replace('Bearer ', '');
        console.log(token);
        if(!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id });

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            message: 'Please authenticate' 
        });
    }
}

module.exports = auth;