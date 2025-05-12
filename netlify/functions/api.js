const express = require('express');
const serverless = require('serverless-http');

// Create Express app
const app = express();

// Middleware
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({
        message: 'API function is working!',
        timestamp: new Date().toISOString(),
        path: req.path
    });
});

// More specific test route
app.get('/test', (req, res) => {
    res.json({
        message: 'Test endpoint working!',
        timestamp: new Date().toISOString()
    });
});

// Handle all other routes
app.all('/*', (req, res) => {
    res.json({
        message: 'Catch-all route',
        path: req.path,
        method: req.method
    });
});

// Export the serverless function
const handler = serverless(app);
module.exports.handler = async (event, context) => {
    console.log('Function invoked with:', event.path);
    return await handler(event, context);
};