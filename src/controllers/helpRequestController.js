const HelpRequest = require('../models/helpRequestModel');
const User = require('../models/userModel');
const notifyNearbyHelpers = require('../utils/smsService');

// Create a new help request
const createHelpRequest = async (req, res) => {
    try {
        const { title, description, urgencyLevel, coinReward, location, completionTime } = req.body;
        const userId = req.user._id;
        console.log(location);
        const ugre=parseInt(urgencyLevel.split(" ")[1]);
        const locationArray = [location.lat, location.lng];
        console.log(locationArray);
        // Check if user has enough coins
        const user = await User.findById(userId);
        if (user.coins < coinReward) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient coins'
            });
        }

        const helpRequest = new HelpRequest({
            requestor: userId,
            title,
            description,
            urgencyLevel:ugre,
            coinReward,
            location: {
                type: 'Point',
                coordinates: locationArray
            },
            completionTime
        });

        await helpRequest.save();

        const nearbyHelpers = await User.find({
            location: {
                $near: {
                    $geometry: helpRequest.location,
                    $maxDistance: 5000
                }
            },
            _id: { $ne: req.user.id }
        }).limit(5);

        for(helper of nearbyHelpers) {
            await notifyNearbyHelpers(helper.phone, helpRequest);
        }

        res.status(201).json({
            success: true,
            message: 'Help request created successfully',
            data: helpRequest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get help request by ID
const getHelpRequestById = async (req, res) => {
    try {
        const { requestId } = req.params;
        const helpRequest = await HelpRequest.findById(requestId)
            .populate('requestor', 'name email')
            .populate('helper', 'name email');

        if (!helpRequest) {
            return res.status(404).json({
                success: false,
                message: 'Help request not found'
            });
        }

        res.json({
            success: true,
            data: helpRequest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all nearby help requests
const getNearbyRequests = async (req, res) => {
    try {
        const { longitude, latitude, maxDistance = 5000 } = req.query; // maxDistance in meters

        const helpRequests = await HelpRequest.find({
            status: 'open',
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseInt(maxDistance)
                }
            }
        }).populate('requestor', 'name');

        res.json({
            success: true,
            data: helpRequests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get my requests (as requestor)
const getMyRequests = async (req, res) => {
    try {
        const userId = req.user._id;
        const helpRequests = await HelpRequest.find({ requestor: userId })
            .populate('helper', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: helpRequests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get my help offers (as helper)
const getMyHelpOffers = async (req, res) => {
    try {
        const userId = req.user._id;
        const helpRequests = await HelpRequest.find({ helper: userId })
            .populate('requestor', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: helpRequests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Accept a help request
const acceptRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const helperId = req.user._id;

        const helpRequest = await HelpRequest.findById(requestId);
        if (!helpRequest) {
            return res.status(404).json({
                success: false,
                message: 'Help request not found'
            });
        }

        if (helpRequest.status !== 'open') {
            return res.status(400).json({
                success: false,
                message: 'This request is no longer available'
            });
        }

        // Prevent requestor from accepting their own request
        if (helpRequest.requestor.toString() === helperId.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot accept your own help request'
            });
        }

        const helperData = await User.findById(helperId);
        helperData.pendingTasks += 1;
        helperData.totalTasks += 1;

        await helperData.save();

        helpRequest.helper = helperId;
        helpRequest.status = 'assigned';
        await helpRequest.save();

        res.json({
            success: true,
            message: 'Help request accepted successfully',
            data: helpRequest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Helper marks task as completed
const markAsCompleted = async (req, res) => {
    try {
        const { requestId } = req.params;
        const helperId = req.user._id;

        const helpRequest = await HelpRequest.findById(requestId);

        if (!helpRequest) {
            return res.status(404).json({
                success: false,
                message: 'Help request not found'
            });
        }

        // Verify this is the assigned helper
        if (helpRequest.helper.toString() !== helperId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Only the assigned helper can mark as completed'
            });
        }

        if (helpRequest.status !== 'assigned') {
            return res.status(400).json({
                success: false,
                message: 'This request cannot be marked as completed'
            });
        }

        helpRequest.status = 'completed';
        await helpRequest.save();

        res.json({
            success: true,
            message: 'Help request marked as completed. Waiting for requestor confirmation',
            data: helpRequest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Requestor confirms completion
const confirmCompletion = async (req, res) => {
    try {
        const { requestId } = req.params;
        const requestorId = req.user._id;

        const helpRequest = await HelpRequest.findById(requestId);

        if (!helpRequest) {
            return res.status(404).json({
                success: false,
                message: 'Help request not found'
            });
        }

        // Verify this is the requestor
        if (helpRequest.requestor.toString() !== requestorId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Only the requestor can confirm completion'
            });
        }

        if (helpRequest.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'This request is not ready for confirmation'
            });
        }

        // Transfer coins
        const requestor = await User.findById(helpRequest.requestor);
        const helper = await User.findById(helpRequest.helper);

        requestor.coins -= helpRequest.coinReward;
        helper.coins += helpRequest.coinReward;
        helper.completedTasks += 1;
        helper.pendingTasks -= 1;

        await requestor.save();
        await helper.save();

        helpRequest.status = 'confirmed';
        await helpRequest.save();

        res.json({
            success: true,
            message: 'Help request confirmed and coins transferred',
            data: helpRequest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Cancel help request (only requestor can cancel)
const cancelRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const helpRequest = await HelpRequest.findById(requestId);

        if (!helpRequest) {
            return res.status(404).json({
                success: false,
                message: 'Help request not found'
            });
        }

        // Verify this is the requestor
        if (helpRequest.requestor.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Only the requestor can cancel the help request'
            });
        }

        if (helpRequest.status !== 'open' && helpRequest.status !== 'assigned') {
            return res.status(400).json({
                success: false,
                message: 'This request cannot be cancelled'
            });
        }

        helpRequest.status = 'cancelled';
        await helpRequest.save();

        const helperId = helpRequest.helper;
        const helperData = await User.findById(helperId);
        helperData.completedTasks -= 1;
        helperData.pendingTasks -= 1;
        await helperData.save();

        res.json({
            success: true,
            message: 'Help request cancelled successfully',
            data: helpRequest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const pastrequestofuser = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log(userId);
        // Find help requests for the logged-in user that are considered "past" requests.
        const pastRequests = await HelpRequest.find({
            requestor: userId,
            status: { $in: ['completed', 'confirmed', 'cancelled'] }
        }).sort({ createdAt: -1 }); // Sort with the most recent first

        return res.status(200).json({
            success: true,
            data: pastRequests
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};




module.exports = {
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
};