const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const signup = async (req, res) => {
    try {
        const { email, password, name, phone, location } = req.body;
        const existingUser = await User.findOne({email});
        const locationArray = [location.lat, location.lng];
        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered.'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            email,
            password: hashedPassword,
            name,
            phone,
            location: {
                type: 'Point',
                coordinates: locationArray
            },

        });
        
        await user.save();
        
        const refreshToken = await user.getJwtToken();
        user.refreshToken = refreshToken;
        console.log(refreshToken);
        
        await user.save();

        res.status(201)
        .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 1000*60*60*24
        })
        .json({
            success: true,
            message: 'User created successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    coins: user.coins
                }
            }
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};  

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        const user = await User.findOne({ email });
        console.log(user);
        if(!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        const isValidPassword = await user.comparePassword(password);
        console.log(isValidPassword);
        if(!isValidPassword) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        const refreshToken = await user.getJwtToken();
        user.refreshToken = refreshToken;
        await user.save();

        res.status(201)
        .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 1000*60*60*24
        })
        .json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    coins: user.coins,
                    totalTasks: user.totalTasks,
                    completedTasks: user.completedTasks,
                    pendingTasks: user.pendingTasks
                }
            }
        });
    } catch(error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}

const logout = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if(!user) {
            res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }
        user.refreshToken = undefined;
        res.status(200)
        .clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        })
        .json({
            success: true,
            message: 'Logout successful'
        });
    } catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    signup,
    login,
    logout
};