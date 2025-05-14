const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');

// Generate JWT token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

// Send response with token
const createSendToken = (doctor, statusCode, res) => {
    const token = signToken(doctor._id);

    // Remove password from output
    doctor.password = undefined;

    res.status(statusCode).json({
        success: true,
        message: statusCode === 201 ? 'Registration successful' : 'Login successful',
        token,
        data: {
            doctor
        }
    });
};

// Doctor Registration
exports.register = async (req, res) => {

    try {
        const {
            name,
            email,
            password,
            phone,
            nmcNumber,
            specialty,
            department,
            mbbsCollege,
            mdCollege,
            yearsOfExperience,
            description,
            available
        } = req.body;

        // Check if doctor already exists
        const existingDoctor = await Doctor.findOne({
            $or: [{ email }, { nmcNumber }]
        });

        if (existingDoctor) {
            return res.status(400).json({
                success: false,
                message: existingDoctor.email === email
                    ? 'Email already registered'
                    : 'NMC number already registered'
            });
        }

        // Get image URL from cloudinary middleware (if uploaded)
        // Handle case where image upload fails but registration should continue

        let imageUrl = 'https://media.istockphoto.com/id/1494498902/vector/a-female-doctor-with-a-stethoscope.jpg?s=612x612&w=0&k=20&c=ijG7Uj1WTtf8ZuFG7CfG3TfcpvOUJWxKbBofUtYrQXc=';
        ;
        if (req.file) {
            imageUrl = req.file.path; // For Cloudinary
        }else {
            console.log('No image uploaded, using default');
        }

        // Create new doctor
        const newDoctor = await Doctor.create({
            name,
            email,
            password,
            phone,
            nmcNumber,
            specialty,
            department,
            mbbsCollege,
            mdCollege,
            yearsOfExperience: parseInt(yearsOfExperience),
            description: description || '',
            available: available === 'true',
            image: imageUrl
        });

        // Send response with token
        createSendToken(newDoctor, 201, res);

    } catch (error) {
        console.error('Registration error:', error);

        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `${field === 'email' ? 'Email' : 'NMC number'} already exists`
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Doctor Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find doctor and include password for comparison
        const doctor = await Doctor.findOne({ email }).select('+password');

        // Check if doctor exists and password is correct
        if (!doctor || !(await doctor.correctPassword(password, doctor.password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        await doctor.updateLastLogin();

        // Send response with token
        createSendToken(doctor, 200, res);

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Doctor Logout
exports.logout = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

// Get current doctor profile
exports.getProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.doctor.id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                doctor
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update doctor profile
exports.updateProfile = async (req, res) => {
    try {
        const {
            name,
            phone,
            specialty,
            department,
            yearsOfExperience,
            description,
            available
        } = req.body;

        // Prepare update object
        const updateData = {
            name,
            phone,
            specialty,
            department,
            yearsOfExperience,
            description,
            available
        };

        // Handle image from cloudinary middleware
        if (req.file && req.file.path) {
            updateData.image = req.file.path;
        }

        // Update doctor
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            req.doctor.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                doctor: updatedDoctor
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};