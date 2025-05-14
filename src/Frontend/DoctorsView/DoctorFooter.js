import React from 'react';
import '../../CSS/DoctorsCSS/DoctorFooter.css';

const DoctorFooter = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { label: 'Dashboard', path: '/doctor/dashboard' },
        { label: 'My Profile', path: '/doctor/profile' },
        { label: 'Appointments', path: '/doctor/appointments' },
        { label: 'Patients', path: '/doctor/patients' }
    ];

    const supportLinks = [
        { label: 'Help Center', path: '/doctor/help' },
        { label: 'Contact Support', path: '/doctor/support' },
        { label: 'Guidelines', path: '/doctor/guidelines' },
        { label: 'Privacy Policy', path: '/doctor/privacy' }
    ];

    return (
        <footer className="doctor-footer">
            <div className="footer-content">
                {/* Quick Links */}
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        {quickLinks.map((link, index) => (
                            <li key={index}>
                                <a href={link.path}>{link.label}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Support */}
                <div className="footer-section">
                    <h4>Support</h4>
                    <ul>
                        {supportLinks.map((link, index) => (
                            <li key={index}>
                                <a href={link.path}>{link.label}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="footer-section">
                    <h4>Contact</h4>
                    <div className="contact-info">
                        <p>📞 +1 (555) 123-4567</p>
                        <p>📧 support@medportal.com</p>
                        <p>🕐 24/7 Emergency Support</p>
                    </div>
                </div>

                
            </div>

            {/* Bottom Section */}
            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <p>
                        Licensed healthcare platform | Secure & HIPAA Compliant
                    </p>
                    <div className="footer-badges">
                        <span className="badge">🔒 Secure</span>
                        <span className="badge">✓ HIPAA</span>
                        <span className="badge">🏥 Certified</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default DoctorFooter;