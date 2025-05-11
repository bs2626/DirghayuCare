// Install required packages
// npm install cloudinary multer multer-storage-cloudinary



// 2. Create a middleware file in your backend: middleware/cloudinaryUpload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'dirghayucare/doctors',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [
            { width: 500, height: 500, crop: 'limit' },
            { quality: 'auto:good' }
        ]
    }
});

// Set up file filter to check file types
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG and PNG image files are allowed!'), false);
    }
};

// Create multer upload middleware
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2 MB
    }
});

module.exports = upload;

// 3. Update your doctorRoutes.js to use this middleware
/*
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

module.exports = router;
*/

// 4. Update your doctorController.js to handle the Cloudinary image URL
/*
// In registerDoctor function:
// Get the image URL if file was uploaded
let imageUrl = 'default-doctor.jpg';
if (req.file) {
  imageUrl = req.file.path; // Cloudinary returns the URL in the path property
}

// Then use this imageUrl when creating the doctor:
const doctor = await Doctor.create({
  user: userId,
  name,
  nmcNumber,
  department,
  mbbsCollege,
  mdCollege: mdCollege || '',
  yearsOfExperience,
  specialty,
  description,
  image: imageUrl
});
*/

// Similarly, update the updateDoctor function to handle image updates