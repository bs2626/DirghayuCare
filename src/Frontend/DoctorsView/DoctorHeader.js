import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CSS/DoctorsCSS/DoctorHeader.css';

const DoctorHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [doctorData, setDoctorData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Get doctor data from localStorage or API
        const token = localStorage.getItem('doctorToken');
        if (token) {
            // Get doctor data from localStorage
            const savedDoctor = localStorage.getItem('doctorData');
            if (savedDoctor && savedDoctor !== 'undefined') {
                try {
                    setDoctorData(JSON.parse(savedDoctor));
                } catch (error) {
                    console.error('Error parsing doctor data:', error);
                    // Clear invalid data
                    localStorage.removeItem('doctorData');
                }
            }
        }
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('doctorToken');
        localStorage.removeItem('doctorData');
        navigate('/doctor/login');
    };

    const menuItems = [
        {
            icon: '🏠',
            label: 'Dashboard',
            action: () => navigate('/doctor/dashboard')
        },
        {
            icon: '👤',
            label: 'My Profile',
            action: () => navigate('/doctor/profile')
        },
        {
            icon: '📅',
            label: 'Appointments',
            action: () => navigate('/doctor/appointments')
        },
        {
            icon: '🩺',
            label: 'Patients',
            action: () => navigate('/doctor/patients')
        },
        {
            icon: '📊',
            label: 'Analytics',
            action: () => navigate('/doctor/analytics')
        },
        {
            icon: '⚙️',
            label: 'Settings',
            action: () => navigate('/doctor/settings')
        },
        {
            icon: '❓',
            label: 'Help & Support',
            action: () => navigate('/doctor/help')
        },
        {
            icon: '🚪',
            label: 'Logout',
            action: handleLogout,
            className: 'logout-item'
        }
    ];

    return (
        <header className="doctor-header">
            <div className="header-content">
                {/* Logo */}
                <div className="logo-section">
                    <img
                        src="../../logo.jpg"
                        alt="MedPortal"
                        className="logo-image"
                    />
                    <span className="logo-text">Dirghayu Care</span>
                </div>



                {/* Right section - Hamburger menu */}
                <div className="right-section">
                    <div className="hamburger-container">
                        <button
                            className={`hamburger-btn ${isMenuOpen ? 'open' : ''}`}
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Dropdown Menu */}
            <div className={`dropdown-menu ${isMenuOpen ? 'open' : ''}`}>
                <div className="menu-content">
                    {/* Doctor Profile Section */}
                    {doctorData && (
                        <div className="menu-profile">
                            <img
                                src={doctorData.image || "https://media.istockphoto.com/id/1494498902/vector/a-female-doctor-with-a-stethoscope.jpg"}
                                alt="Doctor profile"
                                className="profile-image"
                            />
                            <div className="profile-details">
                                <h3>Dr. {doctorData.name}</h3>
                                <p>{doctorData.specialty}</p>
                                <p>{doctorData.department}</p>
                            </div>
                        </div>
                    )}

                    {/* Menu Items */}
                    <nav className="menu-nav">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                className={`menu-item ${item.className || ''}`}
                                onClick={() => {
                                    item.action();
                                    setIsMenuOpen(false);
                                }}
                            >
                                <span className="menu-icon">{item.icon}</span>
                                <span className="menu-label">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Overlay */}
            {isMenuOpen && (
                <div
                    className="menu-overlay"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </header>
    );
};

export default DoctorHeader;