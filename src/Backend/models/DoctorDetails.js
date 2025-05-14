// Create: src/Backend/models/DoctorDetails.js
const mongoose = require('mongoose');

const doctorDetailsSchema = new mongoose.Schema({
    nmcNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    // Statistics
    totalPatients: {
        type: Number,
        default: 0
    },

    avgConsultationTime: {
        type: Number,
        default: 0 // in minutes
    },

    patientRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },

    totalConsultations: {
        type: Number,
        default: 0
    },

    consultationsThisMonth: {
        type: Number,
        default: 0
    },

    consultationsToday: {
        type: Number,
        default: 0
    },

    // Professional Details
    specializationAreas: [{
        type: String,
        trim: true
    }],

    yearsOfExperience: {
        type: Number,
        default: 0
    },

    // Clinic Information
    clinicHours: {
        start: {
            type: String,
            default: '09:00'
        },
        end: {
            type: String,
            default: '17:00'
        },
        workingDays: [{
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        }]
    },

    // Performance Metrics
    averageWaitingTime: {
        type: Number,
        default: 0 // in minutes
    },

    patientSatisfactionRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },

    totalRatings: {
        type: Number,
        default: 0
    },

    // Emergency Info
    emergencyAvailable: {
        type: Boolean,
        default: false
    },

    lastConsultationDate: {
        type: Date,
        default: null
    },

    // Additional Info
    notes: {
        type: String,
        maxlength: 1000
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

// Update the updatedAt field before saving
doctorDetailsSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Calculate average consultation time
doctorDetailsSchema.methods.updateAvgConsultationTime = function(newConsultationTime) {
    if (this.totalConsultations === 0) {
        this.avgConsultationTime = newConsultationTime;
    } else {
        this.avgConsultationTime = Math.round(
            ((this.avgConsultationTime * this.totalConsultations) + newConsultationTime) /
            (this.totalConsultations + 1)
        );
    }
    this.totalConsultations += 1;
};

// Calculate average patient rating
doctorDetailsSchema.methods.updatePatientRating = function(newRating) {
    if (this.totalRatings === 0) {
        this.patientRating = newRating;
    } else {
        this.patientRating =
            ((this.patientRating * this.totalRatings) + newRating) /
            (this.totalRatings + 1);
    }
    this.totalRatings += 1;
};

module.exports = mongoose.model('DoctorDetails', doctorDetailsSchema);