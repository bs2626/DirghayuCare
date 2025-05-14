// Update: src/Backend/controllers/doctorDashboardController.js
const Doctor = require('../models/Doctor');
const DoctorDetails = require('../models/DoctorDetails');
const Appointment = require('../models/Appointments');

// Get dashboard data for a specific doctor
const getDashboardData = async (req, res) => {
    try {
        // Use req.doctor.id to match your token structure
        const doctorId = req.doctor.id || req.doctor.doctorId; // Support both for compatibility

        // Get doctor data from Doctor model by ID
        const doctor = await Doctor.findById(doctorId).select('-password');

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        // Now we have the doctor's NMC number from the Doctor model
        const doctorNmcNumber = doctor.nmcNumber;

        // Get today's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get this month's date range
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

        // Parallel queries for dashboard statistics using the NMC number
        const [
            todaysAppointments,
            totalPatientsCount,
            avgConsultationData,
            patientRating,
            upcomingAppointments,
            recentActivities,
            thisMonthStats
        ] = await Promise.all([
            // Today's appointments count
            Appointment.countDocuments({
                doctorNmcNumber: doctorNmcNumber,
                appointmentDate: { $gte: today, $lt: tomorrow },
                status: { $in: ['scheduled', 'confirmed', 'in-progress'] }
            }),

            // Total unique patients
            Appointment.distinct('patientInfo.phone', {
                doctorNmcNumber: doctorNmcNumber,
                status: 'completed'
            }),

            // Average consultation time
            Appointment.aggregate([
                {
                    $match: {
                        doctorNmcNumber: doctorNmcNumber,
                        status: 'completed',
                        'consultation.actualDuration': { $exists: true, $gt: 0 }
                    }
                },
                {
                    $group: {
                        _id: null,
                        avgDuration: { $avg: '$consultation.actualDuration' },
                        totalConsultations: { $sum: 1 }
                    }
                }
            ]),

            // Patient ratings
            Appointment.aggregate([
                {
                    $match: {
                        doctorNmcNumber: doctorNmcNumber,
                        'rating.patientRating': { $exists: true }
                    }
                },
                {
                    $group: {
                        _id: null,
                        avgRating: { $avg: '$rating.patientRating' },
                        totalRatings: { $sum: 1 }
                    }
                }
            ]),

            // Today's upcoming appointments
            Appointment.find({
                doctorNmcNumber: doctorNmcNumber,
                appointmentDate: { $gte: today, $lt: tomorrow },
                status: { $in: ['scheduled', 'confirmed'] }
            })
                .sort({ appointmentTime: 1 })
                .limit(5)
                .select('appointmentTime patientInfo.name type status')
                .lean(),

            // Recent activities (last 5 completed appointments)
            Appointment.find({
                doctorNmcNumber: doctorNmcNumber,
                status: 'completed'
            })
                .sort({ updatedAt: -1 })
                .limit(5)
                .select('patientInfo.name consultation.notes updatedAt type')
                .lean(),

            // This month's statistics
            Appointment.aggregate([
                {
                    $match: {
                        doctorNmcNumber: doctorNmcNumber,
                        appointmentDate: { $gte: startOfMonth, $lt: startOfNextMonth }
                    }
                },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        // Process the data
        const totalPatients = totalPatientsCount.length;
        const avgConsultation = avgConsultationData.length > 0 ?
            Math.round(avgConsultationData[0].avgDuration) : 0;
        const rating = patientRating.length > 0 ?
            Math.round(patientRating[0].avgRating * 10) / 10 : 0;

        // Calculate this month's completed appointments
        const thisMonthCompleted = thisMonthStats.find(stat => stat._id === 'completed')?.count || 0;
        const lastMonthStart = new Date(startOfMonth);
        lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
        const lastMonthCompleted = await Appointment.countDocuments({
            doctorNmcNumber: doctor.nmcNumber,
            appointmentDate: { $gte: lastMonthStart, $lt: startOfMonth },
            status: 'completed'
        });

        // Format stats for dashboard
        const stats = {
            todaysAppointments: {
                value: todaysAppointments,
                change: `+${todaysAppointments > 0 ? 1 : 0} from yesterday`,
                positive: true
            },
            totalPatients: {
                value: totalPatients,
                change: `+${Math.max(0, thisMonthCompleted - lastMonthCompleted)} this month`,
                positive: true
            },
            avgConsultation: {
                value: avgConsultation,
                change: avgConsultation > 0 ? `${avgConsultation} min average` : 'No data yet',
                positive: true
            },
            patientRating: {
                value: rating,
                change: patientRating.length > 0 ? `Based on ${patientRating[0].totalRatings} reviews` : 'No ratings yet',
                positive: true
            }
        };

        // Format upcoming appointments
        const formattedAppointments = upcomingAppointments.map(apt => ({
            time: apt.appointmentTime,
            patient: apt.patientInfo.name,
            type: apt.type,
            status: apt.status
        }));

        // Format recent activities
        const formattedActivities = recentActivities.map(activity => {
            const timeAgo = getTimeAgo(activity.updatedAt);
            let actionText = '';
            let icon = '✅';

            switch (activity.type) {
                case 'General Checkup':
                    actionText = 'Completed general checkup';
                    icon = '🩺';
                    break;
                case 'Follow-up':
                    actionText = 'Completed follow-up';
                    icon = '🔄';
                    break;
                case 'Emergency':
                    actionText = 'Handled emergency';
                    icon = '🚨';
                    break;
                default:
                    actionText = 'Completed consultation';
                    icon = '✅';
            }

            return {
                action: actionText,
                patient: activity.patientInfo.name,
                time: timeAgo,
                icon: icon
            };
        });

        // Prepare dashboard response
        const dashboardData = {
            doctor: {
                _id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                nmcNumber: doctor.nmcNumber,
                specialty: doctor.specialty,
                department: doctor.department,
                yearsOfExperience: doctor.yearsOfExperience,
                experience: doctor.yearsOfExperience, // Keep both for compatibility
                image: doctor.image === 'default-doctor.jpg'
                    ? "https://media.istockphoto.com/id/1494498902/vector/a-female-doctor-with-a-stethoscope.jpg"
                    : doctor.image,
                mbbsCollege: doctor.mbbsCollege,
                mdCollege: doctor.mdCollege,
                phone: doctor.phone,
                description: doctor.description,
                available: doctor.available,
                isVerified: doctor.isVerified
            },
            stats,
            upcomingAppointments: formattedAppointments,
            recentActivities: formattedActivities,
            summary: {
                totalAppointmentsToday: todaysAppointments,
                totalPatientsServed: totalPatients,
                averageConsultationTime: avgConsultation,
                averageRating: rating,
                thisMonthAppointments: thisMonthCompleted
            }
        };

        res.status(200).json({
            success: true,
            data: dashboardData
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard data',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Helper function to calculate time ago
function getTimeAgo(date) {
    const now = new Date();
    const diffInMs = now - new Date(date);
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
        const diffInMins = Math.floor(diffInMs / (1000 * 60));
        return `${Math.max(1, diffInMins)} minute${diffInMins > 1 ? 's' : ''} ago`;
    }
}

module.exports = {
    getDashboardData
};