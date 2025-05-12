// src/Frontend/AdminDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/AdminDashboard.css';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard-content">
            <div className="admin-welcome-card">
                <h2>Welcome to Dirghayu Care Admin Panel</h2>
                <p>This dashboard allows you to manage doctors, appointments, and other aspects of your healthcare platform.</p>
                <div className="admin-quick-links">
                    <Link to="/admin/doctors" className="admin-quick-link">
                        Manage Doctors
                    </Link>
                </div>
            </div>
            <div className="admin-stats-container">
                <div className="admin-stat-card">
                    <div className="stat-icon">👩‍⚕️</div>
                    <div className="stat-content">
                        <h3>Total Doctors</h3>
                        <p className="stat-number">--</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-icon">📅</div>
                    <div className="stat-content">
                        <h3>Today's Appointments</h3>
                        <p className="stat-number">--</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <h3>Total Patients</h3>
                        <p className="stat-number">--</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;