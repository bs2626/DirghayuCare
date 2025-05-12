const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const path = require('path');

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

// Debug: Test route
app.get('/test', (req, res) => {
    res.json({
        message: 'Function test working',
        timestamp: new Date().toISOString(),
        env: {
            NODE_ENV: process.env.NODE_ENV,
            hasMongoUri: !!process.env.MONGODB_URI
        }
    });
});

// Debug: Check what files exist
app.get('/debug', (req, res) => {
    try {
        const fs = require('fs');
        const backendPath = path.join(__dirname, '../../src/Backend');
        const routesPath = path.join(backendPath, 'routes');

        let debug = {
            backendPathExists: fs.existsSync(backendPath),
            routesPathExists: fs.existsSync(routesPath),
            files: []
        };

        if (debug.backendPathExists) {
            debug.files = fs.readdirSync(backendPath);
        }

        if (debug.routesPathExists) {
            debug.routeFiles = fs.readdirSync(routesPath);
        }

        res.json(debug);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Try different ways to import the doctor routes
let doctorRoutes = null;
const possiblePaths = [
    '../../src/Backend/routes/doctorRoutes',
    '../../src/Backend/routes/doctorRoutes.js',
    '../../src/Backend/routes/doctorRoute',
    '../../src/Backend/routes/doctorRoute.js'
];

for (const routePath of possiblePaths) {
    try {
        console.log(`Trying to import: ${routePath}`);
        doctorRoutes = require(routePath);
        console.log(`Successfully imported from: ${routePath}`);
        break;
    } catch (error) {
        console.log(`Failed to import from ${routePath}:`, error.message);
    }
}

if (doctorRoutes) {
    // Use the routes based on how they're exported
    // Most likely it's set up to handle /api already, so we remove /api prefix
    app.use('/', doctorRoutes);
    console.log('Doctor routes mounted');
} else {
    console.log('Could not import doctor routes, creating fallback');
    app.get('/doctors', (req, res) => {
        res.status(500).json({
            error: 'Doctor routes not found',
            message: 'Could not import doctor routes from any of the expected paths'
        });
    });
}

// Create the serverless handler
const handler = serverless(app);

// Export for Netlify Functions
exports.handler = async (event, context) => {
    console.log('=== Netlify Function Called ===');
    console.log('Method:', event.httpMethod);
    console.log('Original path:', event.path);
    console.log('Query:', event.queryStringParameters);

    // Handle path transformation
    // If path starts with /api, remove it since our routes don't expect it
    let adjustedEvent = { ...event };
    if (event.path.startsWith('/api')) {
        adjustedEvent.path = event.path.replace('/api', '') || '/';
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
                message: error.message,
                stack: error.stack
            })
        };
    }
};