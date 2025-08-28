const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema({
    requestor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }, 
    helper: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }, 
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    urgencyLevel: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    }, 
    coinReward: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: ['open', 'assigned', 'completed', 'confirmed', 'cancelled'],
        default: 'open'
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    completionTime: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

helpRequestSchema.index({ location: '2dsphere' });

const HelpRequest = mongoose.model('HelpRequest', helpRequestSchema);
module.exports = HelpRequest;