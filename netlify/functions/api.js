const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

// Create Express app
const app = express();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://comforting-moxie-7d25bf.netlify.app',
        // Add any other domains you need
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import your routes
// Adjust the path to match your actual backend structure
const doctorRoutes = require('../../src/Backend/routes/doctorRoutes');
const userRoutes = require('../../src/Backend/routes/userRoutes');
const contactRoutes = require('../../src/Backend/routes/contactRoutes');

// Use routes
app.use('/api', doctorRoutes);
app.use('/api', userRoutes);
app.use('/api', contactRoutes);
// Handle Netlify Functions routing
const handler = serverless(app);

module.exports = { handler };

// Alternative export (try this if the above doesn't work)
// module.exports.handler = handler;