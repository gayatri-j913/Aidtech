const User = require('../models/userModel');
const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendCode = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user) {
            res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }
        if(user.verifiedPhone) {
            res.status(400).json({
                success: false,
                message: 'Phone already verified'
            });
        }

        const verification = await twilio.verify.v2
            .services(process.env.TWILIO_VERIFY_SERVICE_SID)
            .verifications
            .create({ to: user.phone, channel: 'sms' });

        res.status(200).json({
            success: true,
            message: 'Verification code sent!',
            status: verification.status
        });
    } catch (error) {
        console.error('Error sending verification:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to send verification code'
        });
    }
}

const verifyCode = async (req, res) => {
    try {
        const { code } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user) {
            res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        if(user.verifiedPhone === true) {
            return res.status(400).json({
                success: false,
                message: 'Phone already verified'
            });
        }

        
        const verificationCheck = await twilio.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks
        .create({ to: user.phone, code });
        
        if (verificationCheck.status === 'approved') {
            user.verifiedPhone = true;
            await user.save();

            res.status(200).json({
                success: true,
                message: 'Phone number verified successfully!',
                valid: true
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid verification code',
                valid: false
            });
        }
    } catch (error) {
        console.error('Error verifying code:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to verify code',
            valid: false
        });
    }
}

module.exports = {
    sendCode,
    verifyCode
}