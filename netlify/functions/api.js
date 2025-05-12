const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const mongoose = require('mongoose');

// Create Express app
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

// Base route (when accessing /.netlify/functions/api directly)
app.get('/', (req, res) => {
    res.json({
        message: 'API Function is running!',
        timestamp: new Date().toISOString(),
        available_endpoints: ['/test', '/db-test', '/doctors']
    });
});

// Test endpoint (accessible at /api/test)
app.get('/test', (req, res) => {
    res.json({
        message: 'Function is working!',
        timestamp: new Date().toISOString()
    });
});

// MongoDB connection test endpoint (accessible at /api/db-test)
app.get('/db-test', async (req, res) => {
    try {
        console.log('Testing MongoDB connection...');

        // Check if MONGODB_URI exists
        if (!process.env.MONGODB_URI) {
            return res.status(500).json({
                error: 'MONGODB_URI not set',
                env_vars: Object.keys(process.env).filter(key => key.startsWith('MONGODB'))
            });
        }

        console.log('MONGODB_URI exists');

        // Check connection state
        const state = mongoose.connection.readyState;
        console.log('Mongoose connection state:', state);

        // Try to connect if not connected
        if (state === 0) {
            console.log('Attempting to connect to MongoDB...');
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000, // 5 second timeout
            });
            console.log('Connected to MongoDB');
        }

        res.json({
            message: 'MongoDB connection test successful',
            connectionState: state,
            dbName: mongoose.connection.db ? mongoose.connection.db.databaseName : 'Not connected'
        });
    } catch (error) {
        console.error('MongoDB connection error:', error);
        res.status(500).json({
            error: 'MongoDB connection failed',
            details: error.message,
            mongodbUri: process.env.MONGODB_URI ? 'Set' : 'Not set'
        });
    }
});

// Simple doctors endpoint (accessible at /api/doctors)
app.get('/doctors', async (req, res) => {
    try {
        console.log('Doctors endpoint called');

        // Check if connected to DB
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        // Try to access a simple collection
        const collections = await mongoose.connection.db.listCollections().toArray();

        res.json({
            message: 'Database accessible',
            collections: collections.map(c => c.name),
            connectionState: mongoose.connection.readyState
        });
    } catch (error) {
        console.error('Doctors endpoint error:', error);
        res.status(500).json({
            error: 'Failed to access database',
            details: error.message
        });
    }
});

// Export for Netlify
exports.handler = serverless(app);