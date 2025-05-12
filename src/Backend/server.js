// server.js - Heroku entry point (create this in your project root)
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const doctorRoutes = require('./src/Backend/routes/doctorRoutes');

// API routes
app.use('/api', doctorRoutes);

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
    // Serve static files from the built React app
    app.use(express.static(path.join(__dirname, 'build')));

    // Handle React Router - send all non-API routes to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}

// Port configuration for Heroku
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});