import React from 'react';
import '../CSS/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-logo-section">
                    <img src="/images/logo.jpg" alt="Dirghayucare Logo" className="footer-logo" />
                    <p className="footer-tagline">Empowering Health, Enriching Lives</p>

                    {/* Social Media Links */}
                    <div className="social-media-links">
                        <a href="https://www.facebook.com/dirghayucare" target="_blank" rel="noopener noreferrer" className="social-link">
                            <img src="/images/facebook-icon.svg" alt="Facebook" className="social-icon" />
                        </a>
                        <a href="https://www.instagram.com/dirghayucare" target="_blank" rel="noopener noreferrer" className="social-link">
                            <img src="/images/instagram-icon.svg" alt="Instagram" className="social-icon" />
                        </a>
                        <a href="https://www.tiktok.com/@dirghayucare" target="_blank" rel="noopener noreferrer" className="social-link">
                            <img src="/images/tiktok-icon.svg" alt="TikTok" className="social-icon" />
                        </a>
                    </div>
                </div>

                <div className="footer-links">
                    <div className="footer-column">
                        <h4 className="footer-heading">Quick Links</h4>
                        <ul className="footer-list">
                            <li><a href="#" className="footer-link">Home</a></li>
                            <li><a href="#" className="footer-link">Doctors</a></li>
                            <li><a href="#" className="footer-link">Services</a></li>
                            <li><a href="#" className="footer-link">Our Team</a></li>
                            <li><a href="#" className="footer-link">Contact</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4 className="footer-heading">Services</h4>
                        <ul className="footer-list">
                            <li><a href="#" className="footer-link">Primary Care</a></li>
                            <li><a href="#" className="footer-link">Preventive Health</a></li>
                            <li><a href="#" className="footer-link">Specialized Care</a></li>
                            <li><a href="#" className="footer-link">Telehealth</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4 className="footer-heading">Contact Us</h4>
                        <ul className="footer-list">
                            <li className="footer-contact-item">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="footer-icon">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>XXX</span>
                            </li>
                            <li className="footer-contact-item">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="footer-icon">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>XXX</span>
                            </li>
                            <li className="footer-contact-item">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="footer-icon">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>XXX</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="copyright">
                <p>&copy; {new Date().getFullYear()} Dirghayucare. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;