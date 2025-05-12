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

// Import your existing Express app
let app;
try {
    // Import your existing backend server
    app = require('../../src/Backend/server');
    console.log('Successfully imported existing backend server');
} catch (error) {
    console.error('Error importing backend server:', error);

    // Create minimal Express app as fallback
    app = express();
    app.use(express.json());

    app.get('/test', (req, res) => {
        res.json({ message: 'Fallback app - could not import backend server', error: error.message });
    });
}

// If your backend server doesn't export the app, create one and import routes
if (!app || typeof app !== 'function') {
    console.log('Creating new Express app and importing routes');

    const newApp = express();

    // Middleware
    newApp.use(express.json());
    newApp.use(express.urlencoded({ extended: true }));

    // CORS
    const cors = require('cors');
    newApp.use(cors({
        origin: [
            'http://localhost:3000',
            'https://comforting-moxie-7d25bf.netlify.app',
            'https://dirghayucare.com'
        ],
        credentials: true
    }));

    // Import and use your routes
    try {
        const doctorRoutes = require('../../src/Backend/routes/doctorRoutes');

        // Your routes are probably set up for /api/doctors already
        // So we use them directly
        newApp.use('/', doctorRoutes);

        console.log('Successfully imported doctor routes');
    } catch (error) {
        console.error('Error importing doctor routes:', error);
        newApp.get('/error', (req, res) => {
            res.status(500).json({ error: 'Could not import routes', details: error.message });
        });
    }

    app = newApp;
}

// Create the serverless handler
const handler = serverless(app);

// Export for Netlify Functions
exports.handler = async (event, context) => {
    // Log the incoming request
    console.log('Request:', event.httpMethod, event.path);

    // Since we're using /api/* redirects, we need to handle the path correctly
    // Netlify sends the full path including /api, but your routes expect paths without it

    // Preserve the original path
    const originalPath = event.path;

    // If the path starts with /api, remove it for your backend routes
    if (event.path.startsWith('/api')) {
        event.path = event.path.replace('/api', '') || '/';
    }

    console.log('Modified path for backend:', event.path);

    try {
        return await handler(event, context);
    } catch (error) {
        console.error('Handler error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Function error',
                message: error.message,
                originalPath: originalPath
            })
        };
    }
};