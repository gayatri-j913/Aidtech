const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
    createHelpRequest,
    getHelpRequestById,
    getNearbyRequests,
    getMyRequests,
    getMyHelpOffers,
    acceptRequest,
    markAsCompleted,
    confirmCompletion,
    cancelRequest,
    pastrequestofuser
} = require('../controllers/helpRequestController');

// Create new help request
router.post('/', auth, createHelpRequest);

// Get past requests of user
router.post('/pastrequestofuser',auth,pastrequestofuser);
// Get nearby help requests

router.get('/nearby', auth, getNearbyRequests);

// Get user's requests (as requestor)
router.get('/my-requests', auth, getMyRequests);

// Get user's help offers (as helper)
router.get('/my-offers', auth, getMyHelpOffers);

// Get specific help request
router.get('/:requestId', auth, getHelpRequestById);

// Accept a help request
router.post('/:requestId/accept', auth, acceptRequest);

// Mark help request as completed (by helper)
router.post('/:requestId/complete', auth, markAsCompleted);

// Confirm help request completion (by requestor)
router.post('/:requestId/confirm', auth, confirmCompletion);

// Cancel help request (by requestor)
router.post('/:requestId/cancel', auth, cancelRequest);

module.exports = router;