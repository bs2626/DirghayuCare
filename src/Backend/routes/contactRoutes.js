const express = require('express');
const router = express.Router();
const { submitContactForm, getContactSubmissions } = require('../controllers/contactController');

// Routes
router.route('/')
    .post(submitContactForm)
    .get(getContactSubmissions);

module.exports = router;