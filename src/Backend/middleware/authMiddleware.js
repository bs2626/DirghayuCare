// Update your backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');

const authMiddleware = async (req, res, next) => {
    try {
        let token;

        // Get token from header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get doctor from database
        const doctor = await Doctor.findById(decoded.id).select('-password');

        if (!doctor) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Doctor not found.'
            });
        }

        // Add doctor to request object
        req.doctor = {
            id: doctor._id,  // This matches your token structure
            doctorId: doctor._id  // Add this for backward compatibility
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

module.exports = authMiddleware;