const User = require('../models/userModel');

const getData = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        user.success = true;
        res.status(201).json(user);
    } catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getData
};