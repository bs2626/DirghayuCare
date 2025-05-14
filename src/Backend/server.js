// server.js - Backend server file
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import routes with error handling
console.log('Importing routes...');

try {
    const authRoutes = require('./routes/authRoutes');
    console.log('✓ Auth routes imported successfully');

    const doctorRoutes = require('./routes/doctorRoutes');
    console.log('✓ Doctor routes imported successfully');

    const contactRoutes = require('./routes/contactRoutes');
    console.log('✓ Contact routes imported successfully');

    const userRoutes = require('./routes/userRoutes');
    console.log('✓ User routes imported successfully');

    // Mount routes with correct base paths
    app.use('/api', authRoutes);           // handles /api/doctorregister, /api/doctorlogin
    app.use('/api/doctors', doctorRoutes); // handles /api/doctors/* routes
    app.use('/api/contact', contactRoutes);
    app.use('/api/users', userRoutes);

    console.log('✓ All routes mounted successfully');

} catch (error) {
    console.error('❌ Error importing routes:', error);
    process.exit(1);
}

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../build')));

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../build', 'index.html'));
    });
}

// Port configuration
const PORT = process.env.PORT || 5000;

console.log('About to start server on port', PORT);

// Start server with error handling
app.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✓ API endpoints available at http://localhost:${PORT}/api`);
}).on('error', (err) => {
    console.error('❌ Server failed to start:', err);

    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please use a different port or kill the process using this port.`);
    }

    process.exit(1);
});