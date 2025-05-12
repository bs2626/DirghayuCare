const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');

// Create Express app first
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors({
    origin: '*',
    credentials: true
}));

// MongoDB connection with detailed logging
async function testMongoConnection() {
    console.log('=== MongoDB Connection Test ===');

    // Check if MONGODB_URI exists
    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI environment variable is not set');
        return false;
    }

    // Log connection string (without password)
    const uriWithoutPassword = process.env.MONGODB_URI.replace(/:([^@]+)@/, ':***@');
    console.log('Connection string format:', uriWithoutPassword);

    try {
        console.log('Attempting connection...');

        // Test connection with specific timeouts
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000, // 10 second timeout
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            bufferMaxEntries: 0,
            bufferCommands: false,
        });

        console.log('✅ MongoDB connected successfully');
        console.log('Database name:', mongoose.connection.db.databaseName);
        console.log('Connection state:', mongoose.connection.readyState);

        // Test a simple operation
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));

        return true;
    } catch (error) {
        console.error('❌ MongoDB connection failed');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error reason:', error.reason?.type);

        // Detailed error analysis
        if (error.message.includes('IP')) {
            console.error('🔍 This might be an IP whitelist issue');
        } else if (error.message.includes('authentication')) {
            console.error('🔍 This might be an authentication issue');
        } else if (error.message.includes('ENOTFOUND')) {
            console.error('🔍 This might be a DNS/domain issue');
        } else if (error.message.includes('timeout')) {
            console.error('🔍 This might be a network timeout issue');
        }

        return false;
    }
}

// Test endpoint to check MongoDB connection
app.get('/mongo-test', async (req, res) => {
    try {
        const isConnected = await testMongoConnection();

        res.json({
            success: isConnected,
            connectionState: mongoose.connection.readyState,
            database: mongoose.connection.db ? mongoose.connection.db.databaseName : null,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Test endpoint
app.get('/test', (req, res) => {
    res.json({
        message: 'Function is working',
        timestamp: new Date().toISOString(),
        env: {
            NODE_ENV: process.env.NODE_ENV,
            hasMongoUri: !!process.env.MONGODB_URI
        }
    });
});

// Try to import doctor routes
let doctorRoutes = null;
try {
    console.log('Importing doctor routes...');
    doctorRoutes = require('../../src/Backend/routes/doctorRoutes');
    console.log('✅ Doctor routes imported successfully');

    // Mount routes
    app.use('/api', doctorRoutes);
} catch (error) {
    console.error('❌ Error importing doctor routes:', error.message);

    // Create fallback route
    app.get('/doctors', (req, res) => {
        res.status(500).json({
            error: 'Could not import doctor routes',
            message: error.message
        });
    });
}

// Serverless handler
const handler = serverless(app);

exports.handler = async (event, context) => {
    console.log('Request:', event.httpMethod, event.path);

    return await handler(event, context);
};