import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorLayout from './DoctorLayout';
import '../../CSS/DoctorsCSS/DoctorDashboard.css';


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const DoctorDashboard = () => {
    const [doctorData, setDoctorData] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            // Check if doctor is logged in
            const token = localStorage.getItem('doctorToken');
            if (!token) {
                navigate('/doctor/login');
                return;
            }

            try {
                setLoading(true);

                // Fetch dashboard data from API
                const response = await fetch(`${API_URL}/doctor/dashboard`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    setDoctorData(data.data.doctor);
                    setDashboardData(data.data);
                    // Update localStorage with fresh doctor data
                    localStorage.setItem('doctorData', JSON.stringify(data.data.doctor));
                } else {
                    // Token might be invalid, redirect to login
                    localStorage.removeItem('doctorData');
                    localStorage.removeItem('doctorToken');
                    navigate('/doctor/login');
                    return;
                }
            } catch (error) {
                console.error('Dashboard fetch error:', error);
                setError('Failed to load dashboard data');

                // Try to use cached data as fallback
                const savedDoctor = localStorage.getItem('doctorData');
                if (savedDoctor && savedDoctor !== 'undefined') {
                    try {
                        setDoctorData(JSON.parse(savedDoctor));
                    } catch (parseError) {
                        console.error('Error parsing cached doctor data:', parseError);
                        localStorage.removeItem('doctorData');
                        localStorage.removeItem('doctorToken');
                        navigate('/doctor/login');
                        return;
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();

        // Update time every minute
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, [navigate]);

    // Use API data if available, otherwise fall back to mock data
    const stats = dashboardData?.stats ? [
        {
            icon: '📅',
            title: 'Today\'s Appointments',
            value: dashboardData.stats.todaysAppointments.value.toString(),
            change: dashboardData.stats.todaysAppointments.change,
            positive: dashboardData.stats.todaysAppointments.positive
        },
        {
            icon: '👥',
            title: 'Total Patients',
            value: dashboardData.stats.totalPatients.value.toLocaleString(),
            change: dashboardData.stats.totalPatients.change,
            positive: dashboardData.stats.totalPatients.positive
        },
        {
            icon: '⏱️',
            title: 'Avg. Consultation',
            value: dashboardData.stats.avgConsultation.value > 0 ?
                `${dashboardData.stats.avgConsultation.value} min` : 'No data',
            change: dashboardData.stats.avgConsultation.change,
            positive: dashboardData.stats.avgConsultation.positive
        },
        {
            icon: '⭐',
            title: 'Patient Rating',
            value: dashboardData.stats.patientRating.value > 0 ?
                dashboardData.stats.patientRating.value.toString() : 'No ratings',
            change: dashboardData.stats.patientRating.change,
            positive: dashboardData.stats.patientRating.positive
        }
    ] : [
        {
            icon: '📅',
            title: 'Today\'s Appointments',
            value: '0',
            change: 'No appointments today',
            positive: true
        },
        {
            icon: '👥',
            title: 'Total Patients',
            value: '0',
            change: 'Start seeing patients',
            positive: true
        },
        {
            icon: '⏱️',
            title: 'Avg. Consultation',
            value: 'No data',
            change: 'Complete appointments to see stats',
            positive: true
        },
        {
            icon: '⭐',
            title: 'Patient Rating',
            value: 'No ratings',
            change: 'Get patient feedback',
            positive: true
        }
    ];

    const upcomingAppointments = dashboardData?.upcomingAppointments && dashboardData.upcomingAppointments.length > 0
        ? dashboardData.upcomingAppointments
        : [];

    const recentActivities = dashboardData?.recentActivities && dashboardData.recentActivities.length > 0
        ? dashboardData.recentActivities
        : [];

    const quickActions = [
        {
            title: 'New Appointment',
            icon: '📅',
            color: '#4A90E2',
            action: () => navigate('/doctor/appointments/new')
        },
        {
            title: 'Patient Search',
            icon: '🔍',
            color: '#10B981',
            action: () => navigate('/doctor/patients')
        },
        {
            title: 'Write Prescription',
            icon: '💊',
            color: '#8B5CF6',
            action: () => navigate('/doctor/prescriptions/new')
        },
        {
            title: 'View Reports',
            icon: '📊',
            color: '#F59E0B',
            action: () => navigate('/doctor/reports')
        }
    ];

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <DoctorLayout>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </DoctorLayout>
        );
    }

    if (error && !doctorData) {
        return (
            <DoctorLayout>
                <div className="error-container">
                    <h2>Error Loading Dashboard</h2>
                    <p>{error}</p>
                    <button
                        className="retry-btn"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            </DoctorLayout>
        );
    }

    return (
        <DoctorLayout>
            <div className="dashboard-container">
                {/* Welcome Section */}
                <div className="welcome-section">
                    <div className="welcome-content">
                        <h1>Good morning, Dr. {doctorData.name}!</h1>
                        <p className="welcome-date">{formatDate(currentDate)}</p>
                        <p className="welcome-time">Current time: {formatTime(currentDate)}</p>
                    </div>
                    <div className="welcome-image">
                        <img
                            src={doctorData.image || "https://media.istockphoto.com/id/1494498902/vector/a-female-doctor-with-a-stethoscope.jpg"}
                            alt="Doctor profile"
                            className="doctor-avatar"
                        />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    {Array.isArray(stats) ? stats.map((stat, index) => (
                        <div key={index} className="stat-card">
                            <div className="stat-icon">{stat.icon}</div>
                            <div className="stat-content">
                                <h3>{stat.value}</h3>
                                <p className="stat-title">{stat.title}</p>
                                <span className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                  {stat.change}
                </span>
                            </div>
                        </div>
                    )) : (
                        <>
                            <div className="stat-card">
                                <div className="stat-icon">📅</div>
                                <div className="stat-content">
                                    <h3>{stats?.todaysAppointments || 0}</h3>
                                    <p className="stat-title">Today's Appointments</p>
                                    <span className="stat-change positive">Loading...</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">👥</div>
                                <div className="stat-content">
                                    <h3>{stats?.totalPatients || 0}</h3>
                                    <p className="stat-title">Total Patients</p>
                                    <span className="stat-change positive">Loading...</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">⏱️</div>
                                <div className="stat-content">
                                    <h3>{stats?.avgConsultation || 0} min</h3>
                                    <p className="stat-title">Avg. Consultation</p>
                                    <span className="stat-change positive">Loading...</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">⭐</div>
                                <div className="stat-content">
                                    <h3>{stats?.rating || 0}</h3>
                                    <p className="stat-title">Patient Rating</p>
                                    <span className="stat-change positive">Loading...</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="dashboard-grid">
                    {/* Quick Actions */}
                    <div className="dashboard-card">
                        <h2>Quick Actions</h2>
                        <div className="quick-actions-grid">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    className="quick-action-btn"
                                    onClick={action.action}
                                    style={{ '--action-color': action.color }}
                                >
                                    <span className="action-icon">{action.icon}</span>
                                    <span className="action-title">{action.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Today's Appointments */}
                    <div className="dashboard-card">
                        <h2>Today's Appointments</h2>
                        {upcomingAppointments.length > 0 ? (
                            <>
                                <div className="appointments-list">
                                    {upcomingAppointments.map((appointment, index) => (
                                        <div key={index} className="appointment-item">
                                            <div className="appointment-time">
                                                <span className="time">{appointment.time}</span>
                                                <span className={`status ${appointment.status}`}>
                          {appointment.status}
                        </span>
                                            </div>
                                            <div className="appointment-details">
                                                <p className="patient-name">{appointment.patient}</p>
                                                <p className="appointment-type">{appointment.type}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="view-all-btn">View All Appointments</button>
                            </>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">📅</div>
                                <p>No appointments scheduled for today</p>
                                <button
                                    className="schedule-btn"
                                    onClick={() => navigate('/doctor/appointments/new')}
                                >
                                    Schedule an Appointment
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Recent Activities */}
                    <div className="dashboard-card">
                        <h2>Recent Activities</h2>
                        {recentActivities.length > 0 ? (
                            <div className="activities-list">
                                {recentActivities.map((activity, index) => (
                                    <div key={index} className="activity-item">
                                        <div className="activity-icon">{activity.icon}</div>
                                        <div className="activity-content">
                                            <p className="activity-action">{activity.action}</p>
                                            <p className="activity-patient">Patient: {activity.patient}</p>
                                            <span className="activity-time">{activity.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">📋</div>
                                <p>No recent activities</p>
                                <p className="empty-subtitle">Complete appointments to see activity history</p>
                            </div>
                        )}
                    </div>

                    {/* Doctor Info Card */}
                    <div className="dashboard-card">
                        <h2>Your Profile</h2>
                        <div className="doctor-profile-card">
                            <img
                                src={doctorData.image || "https://media.istockphoto.com/id/1494498902/vector/a-female-doctor-with-a-stethoscope.jpg"}
                                alt="Doctor profile"
                                className="profile-image"
                            />
                            <div className="profile-info">
                                <h3>Dr. {doctorData.name}</h3>
                                <p>{doctorData.specialty}</p>
                                <p>{doctorData.department}</p>
                                <p>NMC: {doctorData.nmcNumber}</p>
                                <p>Experience: {doctorData.experience} years</p>
                            </div>
                            <button
                                className="edit-profile-btn"
                                onClick={() => navigate('/doctor/profile')}
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Emergency Notice */}
                <div className="emergency-notice">
                    <div className="emergency-content">
                        <span className="emergency-icon">🚨</span>
                        <span className="emergency-text">
              For medical emergencies, contact: <strong>+1 (555) 911-HELP</strong>
            </span>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default DoctorDashboard;