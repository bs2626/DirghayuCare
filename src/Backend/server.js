const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://comforting-moxie-7d25bf.netlify.app'
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection (if using MongoDB)
const mongoose = require('mongoose');
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).catch(err => console.error('MongoDB connection error:', err));
}

// Import routes
const doctorRoutes = require('./routes/doctorRoutes');

// Use routes
app.use('/api/doctors', doctorRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Something went wrong!' });
});

// For local development
const PORT = process.env.PORT || 5000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export the app for Netlify Functions
module.exports = app;