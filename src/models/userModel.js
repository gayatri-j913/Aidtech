const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
    },
    coins: {
        type: Number,
        default: 100
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
    totalTasks: {
        type: Number,
        default: 0
    },     
    completedTasks: {
        type: Number,
        default: 0
    },
    pendingTasks: {
        type: Number,
        default: 0
    }, 
    refreshToken: {
        type: String,
    },
    verifiedPhone: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

userSchema.index({ location: '2dsphere' });

userSchema.methods.getJwtToken = function() {
    return jwt.sign({
        _id: this._id
    },
    process.env.JWT_SECRET,
    {
        expiresIn: '1d'
    }
)};

userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
  
const User = mongoose.model('User', userSchema);
module.exports = User;