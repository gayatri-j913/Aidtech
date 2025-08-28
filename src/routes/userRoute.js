const express = require('express');
const auth = require('../middleware/authMiddleware');
const {getData} = require('../controllers/userDataController');
const router = express.Router();

router.post('/', auth, getData);

module.exports = router;