import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../CSS/Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation(); // Get the current location

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Function to close the menu when a link is clicked
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Function to check if a path is active
    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') {
            return true;
        }
        return path !== '/' && location.pathname.startsWith(path);
    };

    return (
        <header className="header">
            <div className="header-container">
                {/* Logo on extreme left */}
                <div className="logo-container">
                    <Link to="/">
                        <img src="/logo.jpg" alt="Dirghayucare Logo" className="header-logo"/>
                    </Link>
                    <div className="header-slogan">
                        <span><i>Dirghayu Care साथमा, स्वास्थ्य तपाईंको हातमा।</i></span>
                    </div>
                </div>

                {/* Mobile menu button */}
                <div className="mobile-menu-button" onClick={toggleMenu}>
                    <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
                    <ul className="nav-list">
                        <li className="nav-item">
                            <Link
                                to="/"
                                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                                onClick={closeMenu}
                            >
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="/doctors"
                                className={`nav-link ${isActive('/doctors') ? 'active' : ''}`}
                                onClick={closeMenu}
                            >
                                Our Doctors
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="#"
                                className="nav-link"
                                onClick={closeMenu}
                            >
                                Services
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="#"
                                className="nav-link"
                                onClick={closeMenu}
                            >
                                About Us
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="#"
                                className="nav-link"
                                onClick={closeMenu}
                            >
                                Contact
                            </Link>
                        </li>
                    </ul>
                </nav>


            </div>
        </header>
    );
};

export default Header;