// Simple Netlify Function - Starting Fresh
exports.handler = async (event, context) => {
    console.log('Function called:', event.httpMethod, event.path);

    // Log the full event for debugging
    console.log('Full event:', JSON.stringify(event, null, 2));

    // Handle any path
    const path = event.path;
    const method = event.httpMethod;

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

    // Return different responses based on path
    let response = {
        message: `Function is working! Path: ${path}`,
        method: method,
        timestamp: new Date().toISOString(),
        pathInfo: {
            fullPath: path,
            splitPath: path.split('/'),
            lastSegment: path.split('/').pop()
        }
    };

    // Add specific responses for specific paths
    if (path.includes('test')) {
        response.endpoint = 'test endpoint';
    } else if (path.includes('doctors')) {
        response.endpoint = 'doctors endpoint';
    } else if (path.includes('db-test')) {
        response.endpoint = 'database test endpoint';
    }

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response, null, 2)
    };
};