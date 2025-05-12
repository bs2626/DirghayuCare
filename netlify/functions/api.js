// Netlify Function with proper routing
const mongoose = require('mongoose');

exports.handler = async (event, context) => {
    console.log('Function called:', event.httpMethod, event.path);

    // Parse the path to get the actual endpoint
    const path = event.path;
    const method = event.httpMethod;

    // Remove the /api prefix to get the actual route
    const route = path.replace('/api', '') || '/';

    console.log('Parsed route:', route);

    // Basic CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle OPTIONS requests
    if (method === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Route handler
        switch (route) {
            case '/':
            case '/test':
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        message: 'API is working!',
                        route: route,
                        timestamp: new Date().toISOString()
                    })
                };

            case '/db-test':
                return await handleDbTest(headers);

            case '/doctors':
                return await handleDoctors(headers, event);

            case '/doctors/stats':
                return await handleDoctorStats(headers);

            default:
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({
                        error: 'Route not found',
                        path: path,
                        route: route,
                        availableRoutes: ['/test', '/db-test', '/doctors', '/doctors/stats']
                    })
                };
        }
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};

// Database test handler
async function handleDbTest(headers) {
    try {
        console.log('Testing MongoDB connection...');

        // Check if MONGODB_URI exists
        if (!process.env.MONGODB_URI) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'MONGODB_URI not set',
                    env_check: 'MONGODB_URI environment variable is missing'
                })
            };
        }

        console.log('MONGODB_URI found, testing connection...');

        // Check current connection state
        const currentState = mongoose.connection.readyState;
        console.log('Current mongoose state:', currentState);

        // Connect if not already connected
        if (currentState === 0) {
            console.log('Connecting to MongoDB...');
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000,
            });
            console.log('Connected successfully');
        }

        // Test the connection by pinging
        await mongoose.connection.db.admin().ping();
        console.log('Database ping successful');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: 'MongoDB connection successful',
                connectionState: mongoose.connection.readyState,
                databaseName: mongoose.connection.db.databaseName
            })
        };
    } catch (error) {
        console.error('MongoDB test error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'MongoDB connection failed',
                message: error.message,
                details: error.stack
            })
        };
    }
}

// Doctors handler
async function handleDoctors(headers, event) {
    try {
        // Check if connected to database
        if (mongoose.connection.readyState !== 1) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Database not connected',
                    connectionState: mongoose.connection.readyState
                })
            };
        }

        // Simple test - just list collections for now
        const collections = await mongoose.connection.db.listCollections().toArray();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: 'Doctors endpoint working',
                collections: collections.map(c => c.name),
                method: event.httpMethod
            })
        };
    } catch (error) {
        console.error('Doctors handler error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to handle doctors request',
                message: error.message
            })
        };
    }
}

// Doctor stats handler
async function handleDoctorStats(headers) {
    try {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: 'Doctor stats endpoint',
                stats: {
                    total: 0,
                    active: 0
                },
                note: 'This is a placeholder - actual implementation needed'
            })
        };
    } catch (error) {
        console.error('Doctor stats error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to get doctor stats',
                message: error.message
            })
        };
    }
}