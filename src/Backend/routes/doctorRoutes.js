const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');

// Connect to MongoDB
async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        try {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('MongoDB connected');
        } catch (error) {
            console.error('MongoDB connection error:', error);
        }
    }
}

// Connect to database
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
const cors = require('cors');
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://comforting-moxie-7d25bf.netlify.app',
        'https://dirghayucare.com'
    ],
    credentials: true
}));

// Import your doctor routes
try {
    console.log('Importing doctor routes...');
    const doctorRoutes = require('../../src/Backend/routes/doctorRoutes');

    // Your routes expect /api/doctors, so we mount them at /api
    // This way when the path is /doctors, it goes to /api/doctors in your routes
    app.use('/api', doctorRoutes);
    console.log('Doctor routes mounted at /api');
} catch (error) {
    console.error('Error importing doctor routes:', error);

    // Fallback route for debugging
    app.get('/doctors', (req, res) => {
        res.status(500).json({
            error: 'Could not import doctor routes',
            details: error.message
        });
    });
}

// Test route
app.get('/test', (req, res) => {
    res.json({
        message: 'Function test working',
        timestamp: new Date().toISOString()
    });
});

// Create the serverless handler
const handler = serverless(app);

// Export for Netlify Functions
exports.handler = async (event, context) => {
    console.log('=== Netlify Function Called ===');
    console.log('Method:', event.httpMethod);
    console.log('Original path:', event.path);

    // Don't modify the path - let it come through as /api/doctors
    // Your routes are expecting /api/doctors anyway
    let adjustedEvent = { ...event };

    // The redirect sends /api/doctors to /.netlify/functions/api/doctors
    // But serverless-http will see just /doctors
    // So we need to reconstruct the /api prefix for your routes
    if (!event.path.startsWith('/api') && event.path !== '/test') {
        adjustedEvent.path = '/api' + event.path;
        console.log('Adjusted path:', adjustedEvent.path);
    }

    try {
        const result = await handler(adjustedEvent, context);
        console.log('Handler result status:', result.statusCode);
        return result;
    } catch (error) {
        console.error('=== Handler Error ===');
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Function error',
                message: error.message
            })
        };
    }
};