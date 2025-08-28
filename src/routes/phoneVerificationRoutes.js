const express = require('express');
const { sendCode, verifyCode } = require('../controllers/phoneVerificationController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/send-verification', auth, sendCode);
router.post('/verify-code', auth, verifyCode);

module.exports = router;