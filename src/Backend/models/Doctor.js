const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema({
    // Authentication fields
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false // Don't return password in queries
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },

    // Personal information
    name: {
        type: String,
        required: [true, 'Doctor name is required'],
        trim: true
    },

    // Professional information
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
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters'],
        default: ''
    },
    available: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        default: 'default-doctor.jpg'
    },

    // Auth related fields
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'doctor'
    },
    lastLogin: {
        type: Date
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware to hash password and update updatedAt
doctorSchema.pre('save', async function(next) {
    // Only hash password if it's new or modified
    if (!this.isModified('password')) return next();

    // Hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Pre-save middleware to update the updatedAt field
doctorSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Instance method to check password
doctorSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to update last login
doctorSchema.methods.updateLastLogin = function() {
    this.lastLogin = new Date();
    return this.save({ validateBeforeSave: false });
};

// Virtual relationships to connect with other models
// Get doctor's dashboard details
doctorSchema.virtual('details', {
    ref: 'DoctorDetails',
    localField: 'nmcNumber',
    foreignField: 'nmcNumber',
    justOne: true
});

// Get doctor's appointments
doctorSchema.virtual('appointments', {
    ref: 'Appointment',
    localField: 'nmcNumber',
    foreignField: 'doctorNmcNumber'
});

// Instance method to get today's appointments count
doctorSchema.methods.getTodaysAppointments = async function() {
    const Appointment = mongoose.model('Appointment');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await Appointment.countDocuments({
        doctorNmcNumber: this.nmcNumber,
        appointmentDate: {
            $gte: today,
            $lt: tomorrow
        },
        status: { $in: ['scheduled', 'confirmed', 'in-progress'] }
    });
};

// Instance method to get total patients count
doctorSchema.methods.getTotalPatients = async function() {
    const Appointment = mongoose.model('Appointment');
    const patients = await Appointment.distinct('patientInfo.phone', {
        doctorNmcNumber: this.nmcNumber,
        status: 'completed'
    });
    return patients.length;
};

// Ensure virtual fields are included in JSON output
doctorSchema.set('toJSON', { virtuals: true });
doctorSchema.set('toObject', { virtuals: true });

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;