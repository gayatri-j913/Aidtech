require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const helpRequestRoutes = require('./src/routes/helpRequestRoutes');
const verificationRoutes = require('./src/routes/phoneVerificationRoutes');
const dataRoutes = require('./src/routes/userRoute');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/phone-verification', verificationRoutes);
app.use('/api/help-requests', helpRequestRoutes);
app.use('/api/get-data', dataRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Basic error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!' 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});