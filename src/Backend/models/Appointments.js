// Create: src/Backend/models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    // Unique appointment ID
    appointmentId: {
        type: String,
        required: true,
        unique: true,
        default: function() {
            return 'APT' + Date.now() + Math.floor(Math.random() * 1000);
        }
    },

    // Doctor Information
    doctorNmcNumber: {
        type: String,
        required: true,
        ref: 'Doctor' // Reference to Doctor model
    },

    doctorName: {
        type: String,
        required: true
    },

    // Patient Information (for now, just basic info - later will reference User model)
    patientInfo: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        age: {
            type: Number,
            min: 0,
            max: 150
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
            required: true
        }
    },

    // Appointment Details
    appointmentDate: {
        type: Date,
        required: true
    },

    appointmentTime: {
        type: String,
        required: true // Format: "14:30"
    },

    duration: {
        type: Number,
        default: 30 // in minutes
    },

    type: {
        type: String,
        enum: ['General Checkup', 'Follow-up', 'Emergency', 'Consultation', 'Specialist', 'Routine'],
        required: true,
        default: 'General Checkup'
    },

    status: {
        type: String,
        enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
        default: 'scheduled'
    },

    priority: {
        type: String,
        enum: ['low', 'normal', 'high', 'urgent'],
        default: 'normal'
    },

    // Medical Information
    reasonForVisit: {
        type: String,
        required: true,
        maxlength: 500
    },

    symptoms: [{
        type: String,
        trim: true
    }],

    // Consultation Details (filled after appointment)
    consultation: {
        startTime: Date,
        endTime: Date,
        actualDuration: Number, // calculated from start/end time
        notes: {
            type: String,
            maxlength: 2000
        },
        diagnosis: {
            type: String,
            maxlength: 1000
        },
        prescription: [{
            medication: String,
            dosage: String,
            frequency: String,
            duration: String,
            instructions: String
        }],
        followUpRequired: {
            type: Boolean,
            default: false
        },
        followUpDate: Date,
        doctorNotes: {
            type: String,
            maxlength: 1000
        }
    },

    // Payment Information
    payment: {
        amount: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending'
        },
        method: {
            type: String,
            enum: ['cash', 'card', 'insurance', 'online'],
            default: 'cash'
        },
        transactionId: String
    },

    // Rating and Feedback (after consultation)
    rating: {
        patientRating: {
            type: Number,
            min: 1,
            max: 5
        },
        patientFeedback: {
            type: String,
            maxlength: 500
        },
        ratingDate: Date
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
appointmentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Calculate actual duration when consultation ends
appointmentSchema.methods.completeConsultation = function(endTime, notes, diagnosis) {
    if (this.consultation.startTime) {
        this.consultation.endTime = endTime;
        this.consultation.actualDuration = Math.round(
            (endTime - this.consultation.startTime) / (1000 * 60)
        ); // Convert to minutes
    }
    this.consultation.notes = notes;
    this.consultation.diagnosis = diagnosis;
    this.status = 'completed';
};

// Indexes for better query performance
appointmentSchema.index({ doctorNmcNumber: 1, appointmentDate: 1 });
appointmentSchema.index({ appointmentDate: 1, status: 1 });
appointmentSchema.index({ 'patientInfo.phone': 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);