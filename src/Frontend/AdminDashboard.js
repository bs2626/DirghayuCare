// src/Frontend/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../CSS/AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if admin is authenticated
        const adminAuth = localStorage.getItem('adminAuth');
        if (adminAuth !== 'yes') {
            // Redirect to login page if not authenticated
            navigate('/admin/login');
        } else {
            setIsAuthenticated(true);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        navigate('/admin/login');
    };

    if (!isAuthenticated) {
        return null; // Don't render anything while checking authentication
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2>Admin Panel</h2>
                </div>
                <nav className="admin-nav">
                    <Link to="/admin/dashboard" className="admin-nav-link active">
                        Dashboard
                    </Link>
                    <Link to="/admin/doctors" className="admin-nav-link">
                        Manage Doctors
                    </Link>
                    <button onClick={handleLogout} className="admin-logout-btn">
                        Logout
                    </button>
                </nav>
            </div>
            <div className="admin-main">
                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                </div>
                <div className="admin-content">
                    <div className="admin-welcome-card">
                        <h2>Welcome to Dirghayu Care Admin Panel</h2>
                        <p>This dashboard allows you to manage doctors, appointments, and other aspects of your healthcare platform.</p>
                        <div className="admin-quick-links">
                            <Link to="/admin/doctors" className="admin-quick-link">
                                Manage Doctors
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;