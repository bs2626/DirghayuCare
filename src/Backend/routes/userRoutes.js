const express = require('express');
const router = express.Router();
const { registerUser, getUsers, getUser } = require('../controllers/userController');

// Routes
router.route('/')
    .post(registerUser)
    .get(getUsers);

router.route('/:id')
    .get(getUser);

module.exports = router;