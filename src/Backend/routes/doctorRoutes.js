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

// Get doctor statistics - /api/doctors/stats
router.get('/stats', getDoctorStats);

// Routes for all doctors - /api/doctors
router.route('/')
    .post(upload.single('profileImage'), registerDoctor)
    .get(getDoctors);

// Routes for specific doctor - /api/doctors/:id
router.route('/:id')
    .get(getDoctor)
    .put(upload.single('profileImage'), updateDoctor)
    .delete(deleteDoctor);

module.exports = router;