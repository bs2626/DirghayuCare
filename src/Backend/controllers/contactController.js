const Contact = require('../models/Contact');

// @desc    Submit a new contact form
// @route   POST /api/contact
// @access  Public
exports.submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Create new contact entry
        const contact = await Contact.create({
            name,
            email,
            phone,
            message
        });

        res.status(201).json({
            success: true,
            data: contact,
            message: 'Your message has been submitted successfully'
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

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private (would require authentication in production)
exports.getContactSubmissions = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};