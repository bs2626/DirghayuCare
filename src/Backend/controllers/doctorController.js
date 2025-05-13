const Doctor = require('../models/Doctor');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;


// @desc    Register a new doctor
// @route   POST /api/doctors
// @access  Private (Admin/Doctor)
// In doctorController.js - registerDoctor function
exports.registerDoctor = async (req, res) => {
    try {
        const {
            name,
            nmcNumber,
            department,
            mbbsCollege,
            mdCollege,
            yearsOfExperience,
            specialty,
            description
        } = req.body;

        // Check if doctor NMC number already exists
        const doctorExists = await Doctor.findOne({ nmcNumber });
        if (doctorExists) {
            return res.status(400).json({
                success: false,
                error: 'Doctor with this NMC number already exists'
            });
        }

        // Get the image URL if file was uploaded
        let imageUrl = 'default-doctor.jpg';
        if (req.file) {
            imageUrl = req.file.path; // For Cloudinary
        }

        // Create new doctor without the user reference
        const doctor = await Doctor.create({
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

        res.status(201).json({
            success: true,
            data: doctor,
            message: 'Doctor profile created successfully'
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

// In doctorController.js - getDoctors function

exports.getDoctors = async (req, res) => {
    try {
        // Build query
        let query = {};

        // Filter by department if provided
        if (req.query.department) {
            query.department = req.query.department;
        }

        // Filter by specialty if provided
        if (req.query.specialty) {
            query.specialty = req.query.specialty;
        }

        // Execute query without population
        const doctors = await Doctor.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public


// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
// In doctorController.js
exports.getDoctor = async (req, res) => {
    try {


        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                error: 'Doctor not found'
            });
        }

        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (error) {
        console.error("Error in getDoctor:", error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};
// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private (Admin/Doctor)
// exports.updateDoctor = async (req, res) => {
//     try {
//         let doctor = await Doctor.findById(req.params.id);
//
//         if (!doctor) {
//             return res.status(404).json({
//                 success: false,
//                 error: 'Doctor not found'
//             });
//         }
//
//         // Update fields
//         doctor = await Doctor.findByIdAndUpdate(
//             req.params.id,
//             { ...req.body, updatedAt: Date.now() },
//             {
//                 new: true,
//                 runValidators: true
//             }
//         );
//
//         res.status(200).json({
//             success: true,
//             data: doctor,
//             message: 'Doctor profile updated successfully'
//         });
//     } catch (error) {
//         console.error(error);
//
//         // Handle validation errors
//         if (error.name === 'ValidationError') {
//             const messages = Object.values(error.errors).map(val => val.message);
//             return res.status(400).json({
//                 success: false,
//                 error: messages
//             });
//         }
//
//         res.status(500).json({
//             success: false,
//             error: 'Server Error'
//         });
//     }
// };
// Updated updateDoctor function in doctorController.js
exports.updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // Convert yearsOfExperience to number if it exists
        if (updateData.yearsOfExperience) {
            updateData.yearsOfExperience = parseInt(updateData.yearsOfExperience, 10);
        }

        // Convert available to boolean if it exists
        if (updateData.available !== undefined) {
            updateData.available = updateData.available === 'true' || updateData.available === true;
        }

        // Check if a new image was uploaded
        if (req.file) {


            // Get the existing doctor to check for current image
            const existingDoctor = await Doctor.findById(id);

            // Delete old image from Cloudinary if it exists and isn't the default
            if (existingDoctor && existingDoctor.image && existingDoctor.image !== 'default-doctor.jpg') {
                try {
                    // Extract public_id from Cloudinary URL
                    // The format is typically: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/dirghayucare/doctors/filename.jpg
                    const urlParts = existingDoctor.image.split('/');
                    const fileName = urlParts[urlParts.length - 1].split('.')[0];
                    const publicId = `dirghayucare/doctors/${fileName}`;

                    await cloudinary.uploader.destroy(publicId);


                } catch (deleteError) {
                    console.log('Failed to delete old image:', deleteError);
                    // Don't fail the update if we can't delete the old image
                }
            }

            // Add the new image URL to updateData
            // Cloudinary middleware puts the URL in req.file.path
            updateData.image = req.file.path;

        }

        // Update the doctor document
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true, // Return the updated document
                runValidators: true // Run schema validations
            }
        );

        if (!updatedDoctor) {
            return res.status(404).json({
                success: false,
                error: 'Doctor not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Doctor updated successfully',
            data: updatedDoctor
        });

    } catch (error) {
        console.error('Update doctor error:', error);

        // Handle specific multer errors
        if (error.message.includes('Only JPEG and PNG image files are allowed!')) {
            return res.status(400).json({
                success: false,
                error: 'Only JPEG and PNG image files are allowed!'
            });
        }

        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: 'File size too large. Maximum allowed size is 2MB.'
            });
        }

        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
};
// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private (Admin)
// Update your deleteDoctor function in doctorController.js

exports.deleteDoctor = async (req, res) => {
    try {
        console.log('Attempting to delete doctor with ID:', req.params.id);

        // Find the doctor by ID
        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            console.log('Doctor not found');
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        console.log('Found doctor:', doctor.name);

        // Use deleteOne() instead of remove()
        await doctor.deleteOne();

        // Alternative approach - you can also use:
        // await Doctor.findByIdAndDelete(req.params.id);

        console.log('Doctor deleted successfully');

        res.status(200).json({
            success: true,
            message: 'Doctor deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting doctor:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get doctor statistics
// @route   GET /api/doctors/stats
// @access  Public
exports.getDoctorStats = async (req, res) => {
    try {
        // Count doctors by department
        const departmentStats = await Doctor.aggregate([
            { $group: { _id: '$department', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Count doctors by specialty
        const specialtyStats = await Doctor.aggregate([
            { $group: { _id: '$specialty', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Get total number of doctors
        const totalDoctors = await Doctor.countDocuments();

        // Get average years of experience
        const experienceStats = await Doctor.aggregate([
            {
                $group: {
                    _id: null,
                    averageExperience: { $avg: '$yearsOfExperience' },
                    maxExperience: { $max: '$yearsOfExperience' },
                    minExperience: { $min: '$yearsOfExperience' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalDoctors,
                departmentStats,
                specialtyStats,
                experienceStats: experienceStats[0] || { averageExperience: 0, maxExperience: 0, minExperience: 0 }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};