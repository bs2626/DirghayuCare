const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Doctor name is required'],
        trim: true
    },
    nmcNumber: {
        type: String,
        required: [true, 'NMC number is required'],
        unique: true,
        trim: true
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true
    },
    mbbsCollege: {
        type: String,
        required: [true, 'MBBS college is required'],
        trim: true
    },
    mdCollege: {
        type: String,
        trim: true,
        default: ''
    },
    yearsOfExperience: {
        type: Number,
        required: [true, 'Years of experience is required'],
        min: [0, 'Years of experience cannot be negative']
    },
    specialty: {
        type: String,
        required: [true, 'Specialty is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    available: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        default: 'default-doctor.jpg'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware to update the updatedAt field
doctorSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;