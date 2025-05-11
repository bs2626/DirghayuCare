const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
exports.registerUser = async (req, res) => {
    try {
        const { name, email, phone, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                error: 'User with this email already exists'
            });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            phone,
            role: role || 'patient' // Default to patient if role not specified
        });

        res.status(201).json({
            success: true,
            data: user,
            message: 'User registered successfully'
        });
    } catch (error) {
        console.error(error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }

        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private (would require authentication in production)
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};