const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

// Create a new Express app specifically for the function
const app = express();

// Enable CORS
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://comforting-moxie-7d25bf.netlify.app'
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple test route
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Function is working!',
        timestamp: new Date().toISOString()
    });
});

// Try to import and use your routes
try {
    console.log('Attempting to import doctor routes...');
    const doctorRoutes = require('../../src/Backend/routes/doctorRoutes');
    app.use('/api/doctors', doctorRoutes);
    console.log('Doctor routes imported successfully');
} catch (error) {
    console.error('Error importing doctor routes:', error);

    // Create a basic doctors route as fallback
    app.get('/api/doctors', (req, res) => {
        res.status(500).json({
            error: 'Could not load doctor routes',
            details: error.message
        });
    });
}

// Export for Netlify
exports.handler = serverless(app);