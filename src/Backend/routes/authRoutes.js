const express = require('express');
const {
    register: doctorAuthRegister,
    login: doctorLogin,
    logout,
    getProfile,
    updateProfile
} = require('../controllers/doctorAuthController');
const { getDashboardData } = require('../controllers/doctorDashboardController');
const upload = require('../middleware/cloudinaryUpload');
const authMiddleware = require('../middleware/authMiddleware');
const Doctor = require('../models/Doctor');

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Auth routes working!' });
});

// Custom middleware to handle Cloudinary errors
const cloudinaryUploadWithFallback = (req, res, next) => {
    console.log('Starting Cloudinary upload...');

    upload.single('profileImage')(req, res, (error) => {
        if (error) {

            // Continue to the next middleware even if upload fails
            req.cloudinaryError = error;
            next();
        } else {

            next();
        }
    });
};
router.get('/doctors', async (req, res) => {
    try {
        const { department, specialty, page = 1, limit = 20 } = req.query;

        // Build query object - removed isVerified and available filters
        let query = {};

        if (department) {
            query.department = new RegExp(department, 'i'); // Case insensitive search
        }

        if (specialty) {
            query.specialty = new RegExp(specialty, 'i'); // Case insensitive search
        }

        // Get doctors with pagination
        const doctors = await Doctor.find(query)
            .select('-password -createdAt -updatedAt -lastLogin') // Exclude sensitive fields
            .sort({ yearsOfExperience: -1, name: 1 }) // Sort by experience desc, then name asc
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        // Get total count for pagination
        const total = await Doctor.countDocuments(query);

        res.status(200).json({
            success: true,
            data: doctors,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total: total
            }
        });

    } catch (error) {
        console.error('Get doctors error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch doctors'
        });
    }
});

// Get doctor by ID - PUBLIC ROUTE
router.get('/doctors/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id)
            .select('-password -lastLogin')
            .lean();

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Removed verification and availability checks - return doctor regardless
        res.status(200).json({
            success: true,
            data: doctor
        });

    } catch (error) {
        console.error('Get doctor by ID error:', error);

        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid doctor ID'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to fetch doctor'
        });
    }
});


// Public routes (no authentication required)
router.post('/doctor/register', cloudinaryUploadWithFallback, doctorAuthRegister);
router.post('/doctor/login', doctorLogin);

// Protected routes (authentication required)
router.use(authMiddleware); // Apply auth middleware to all routes below

router.post('/logout', logout);
router.get('/doctor/profile', getProfile);
router.put('/doctor/profile', cloudinaryUploadWithFallback, updateProfile);
router.get('/doctor/dashboard', getDashboardData);

module.exports = router;