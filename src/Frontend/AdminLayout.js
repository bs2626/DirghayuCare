// src/Components/AdminLayout.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import '../CSS/AdminLayout.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    useEffect(() => {
        // Check if it's mobile view
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        navigate('/admin/login');
    };

    const toggleSidebar = () => {
        if (isMobile) {
            setIsSidebarOpen(!isSidebarOpen);
        } else {
            setIsSidebarCollapsed(!isSidebarCollapsed);
        }
    };

    const isActiveRoute = (path) => {
        return location.pathname === path || location.pathname.startsWith(path);
    };

    if (!isAuthenticated) {
        return null; // Don't render anything while checking authentication
    }

    return (
        <div className="admin-layout">
            {/* Mobile overlay */}
            {isMobile && isSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
            <div className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isMobile ? (isSidebarOpen ? 'mobile-open' : 'mobile-closed') : ''}`}>
                <div className="admin-sidebar-header">
                    <h2 className="admin-title">
                        {isSidebarCollapsed && !isMobile ? 'AC' : 'Admin Panel'}
                    </h2>
                    <button
                        className="sidebar-toggle-btn"
                        onClick={toggleSidebar}
                        aria-label="Toggle Sidebar"
                    >
                        <span className="hamburger"></span>
                        <span className="hamburger"></span>
                        <span className="hamburger"></span>
                    </button>
                </div>
                <nav className="admin-nav">
                    <Link
                        to="/admin/dashboard"
                        className={`admin-nav-link ${isActiveRoute('/admin/dashboard') ? 'active' : ''}`}
                        onClick={() => isMobile && setIsSidebarOpen(false)}
                    >
                        <span className="nav-icon">📊</span>
                        <span className="nav-text">Dashboard</span>
                    </Link>
                    <Link
                        to="/admin/doctors"
                        className={`admin-nav-link ${isActiveRoute('/admin/doctors') ? 'active' : ''}`}
                        onClick={() => isMobile && setIsSidebarOpen(false)}
                    >
                        <span className="nav-icon">👩‍⚕️</span>
                        <span className="nav-text">Manage Doctors</span>
                    </Link>
                    <button
                        onClick={() => {
                            if (isMobile) setIsSidebarOpen(false);
                            handleLogout();
                        }}
                        className="admin-logout-btn"
                    >
                        <span className="nav-icon">🚪</span>
                        <span className="nav-text">Logout</span>
                    </button>
                </nav>
            </div>
            <div className={`admin-main ${isSidebarCollapsed && !isMobile ? 'expanded' : ''}`}>
                <div className="admin-header">
                    <div className="header-content">
                        {isMobile && (
                            <button
                                className="mobile-menu-btn"
                                onClick={toggleSidebar}
                                aria-label="Open Menu"
                            >
                                <span className="hamburger"></span>
                                <span className="hamburger"></span>
                                <span className="hamburger"></span>
                            </button>
                        )}
                        <h1>{getPageTitle(location.pathname)}</h1>
                    </div>
                </div>
                <div className="admin-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

// Helper function to get page title based on route
const getPageTitle = (pathname) => {
    switch (pathname) {
        case '/admin/dashboard':
            return 'Admin Dashboard';
        case '/admin/doctors':
            return 'Manage Doctors';
        default:
            if (pathname.includes('/admin/doctors/edit')) {
                return 'Edit Doctor';
            }
            return 'Admin Panel';
    }
};

export default AdminLayout;