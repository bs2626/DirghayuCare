const express = require('express');
const router = express.Router();
const {
    registerDoctor,
    getDoctors,
    getDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctorStats
} = require('../controllers/doctorController');
const upload = require('../middleware/cloudinaryUpload');

// Get doctor statistics
router.get('/stats', getDoctorStats);

// Routes for all doctors
router.route('/')
    .post(upload.single('profileImage'), registerDoctor)
    .get(getDoctors);

// Routes for specific doctor
router.route('/:id')
    .get(getDoctor)
    .put(upload.single('profileImage'), updateDoctor)
    .delete(deleteDoctor);

// Admin routes
router.get('/admin/doctors/edit/:id', updateDoctor);


module.exports = router;