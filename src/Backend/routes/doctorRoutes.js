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
            console.log('MongoDB connected successfully');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            throw error;
        }
    }
}

// Initialize database connection
connectDB().catch(console.error);

// Create Express app
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
console.log('=== Importing Doctor Routes ===');
let doctorRoutes = null;

try {
    // Correct path with 's' in Routes
    console.log('Importing doctorRoutes from: ../../src/Backend/routes/doctorRoutes');
    doctorRoutes = require('../../src/Backend/routes/doctorRoutes');
    console.log('✅ Doctor routes imported successfully');
} catch (error) {
    console.error('❌ Error importing doctor routes:', error.message);
    console.error('Error details:', error);
}

// Set up routes
if (doctorRoutes) {
    // Your routes expect /api prefix, so mount them at /api
    app.use('/api', doctorRoutes);
    console.log('Doctor routes mounted at /api');

    // Add a test route to verify mounting
    app.get('/test-routes', (req, res) => {
        res.json({
            message: 'Routes mounted successfully',
            mounted: true,
            availableEndpoints: [
                '/api/doctors',
                '/api/doctors/stats',
                '/api/doctors/:id'
            ]
        });
    });
} else {
    console.log('❌ Doctor routes not available - setting up fallback');
    app.get('/doctors', (req, res) => {
        res.status(500).json({
            error: 'Doctor routes not imported',
            message: 'Could not load doctor routes module'
        });
    });
}

// Basic test endpoint
app.get('/test', (req, res) => {
    res.json({
        message: 'API function is working',
        timestamp: new Date().toISOString(),
        routesLoaded: !!doctorRoutes,
        dbConnected: mongoose.connection.readyState === 1
    });
});

// Create serverless handler
const handler = serverless(app);

// Export for Netlify Functions
exports.handler = async (event, context) => {
    console.log('=== Netlify Function Called ===');
    console.log('Method:', event.httpMethod);
    console.log('Original path:', event.path);
    console.log('Headers:', event.headers);

    // The path comes in as /api/doctors from the redirect
    // We need to pass it through unchanged since our routes expect /api prefix

    try {
        const result = await handler(event, context);
        console.log('Handler result status:', result.statusCode);
        return result;
    } catch (error) {
        console.error('=== Handler Error ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Function execution error',
                message: error.message,
                timestamp: new Date().toISOString()
            })
        };
    }
};