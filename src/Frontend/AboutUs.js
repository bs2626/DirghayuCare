import React from 'react';
import '../CSS/AboutUs.css';
import Header from './Header';
import Footer from './Footer';

const AboutUs = () => {
    return (
        <div className="about-container">
            {/* Include the Header component */}


            {/* Hero Section - with spacing to accommodate fixed header */}
            <div className="hero-section with-header-spacing">
                <div className="hero-content">
                    <img src="/images/logo.jpg" alt="Dirghayucare Logo" className="hero-logo" />
                    <h1 className="hero-title">Welcome to Dirghayu Care</h1>
                    <p className="hero-subtitle">Empowering Health, Enriching Lives</p>
                    <button className="cta-button">Discover Our Services</button>
                </div>
            </div>

            {/* Mission Section */}
            <div className="mission-section">
                <div className="section-container">
                    <h2 className="section-title">Our Mission</h2>
                    <div className="mission-content">
                        <div className="mission-text">
                            <p>

                                We envision a Nepal where no one is left waiting for care—
                                where a question about your health doesn’t need a bus ride, a hospital visit, or a desperate call to someone far away.
                                At Dirghayu Care, our vision is to make basic, reliable healthcare guidance accessible to every household—urban or remote, connected or forgotten.
                            </p>
                            <p>
                                We are working toward a future where:

                                <li> A family in Bajhang can speak to a doctor with the same ease as a family in Kathmandu.</li>
                                <li> A father in Birgunj doesn’t wait in silence because he doesn’t want to “bother” his son abroad.</li>
                                <li> A young woman in Dang can confidently seek medical help without judgment, cost, or confusion.</li>

                            </p>
                            <p>
                                We believe healthcare starts with a conversation—one that is timely, kind, and clear.
                                And we believe technology can bring that conversation to everyone.
                                Our vision is not grand—it is grounded:
                                One phone call. One answer. One life with less fear, more clarity, and better care.

                            </p>
                        </div>
                        {/*<div className="mission-image">*/}
                        {/*    <img src="/images/mission-image.jpg" alt="Healthcare professionals" className="section-image" />*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="values-section">
                <div className="section-container">
                    <h2 className="section-title">Our Core Values</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="icon-svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="value-title">Compassion</h3>
                            <p className="value-description">
                                We approach every patient with empathy, understanding, and genuine care.
                            </p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="icon-svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="value-title">Excellence</h3>
                            <p className="value-description">
                                We strive for the highest standards in healthcare delivery and patient outcomes.
                            </p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="icon-svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                                </svg>
                            </div>
                            <h3 className="value-title">Innovation</h3>
                            <p className="value-description">
                                We embrace innovative solutions and technologies to enhance patient care.
                            </p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="icon-svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="value-title">Collaboration</h3>
                            <p className="value-description">
                                We work as a team with patients, families, and healthcare partners.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            {/*<div className="team-section">*/}
            {/*    <div className="section-container">*/}
            {/*        <h2 className="section-title">Our Expert Team</h2>*/}
            {/*        <p className="team-intro">*/}
            {/*            Our dedicated team of healthcare professionals combines years of experience*/}
            {/*            with a passion for patient care.*/}
            {/*        </p>*/}
            {/*        <div className="team-grid">*/}
            {/*            /!* Team Member 1 *!/*/}
            {/*            <div className="team-card">*/}
            {/*                <div className="team-image-container">*/}
            {/*                    <img src="/images/team-member1.jpg" alt="Dr. Anisha Sharma" className="team-image" />*/}
            {/*                </div>*/}
            {/*                <h3 className="team-name">Dr. Anisha Sharma</h3>*/}
            {/*                <p className="team-position">Chief Medical Officer</p>*/}
            {/*                <p className="team-bio">*/}
            {/*                    Dr. Sharma brings over 15 years of experience in integrated healthcare approaches.*/}
            {/*                </p>*/}
            {/*            </div>*/}

            {/*            /!* Team Member 2 *!/*/}
            {/*            <div className="team-card">*/}
            {/*                <div className="team-image-container">*/}
            {/*                    <img src="/images/team-member2.jpg" alt="Dr. Rajiv Mehta" className="team-image" />*/}
            {/*                </div>*/}
            {/*                <h3 className="team-name">Dr. Rajiv Mehta</h3>*/}
            {/*                <p className="team-position">Director of Patient Care</p>*/}
            {/*                <p className="team-bio">*/}
            {/*                    Specializing in personalized care plans with a focus on preventive health.*/}
            {/*                </p>*/}
            {/*            </div>*/}

            {/*            /!* Team Member 3 *!/*/}
            {/*            <div className="team-card">*/}
            {/*                <div className="team-image-container">*/}
            {/*                    <img src="/images/team-member3.jpg" alt="Dr. Priya Patel" className="team-image" />*/}
            {/*                </div>*/}
            {/*                <h3 className="team-name">Dr. Priya Patel</h3>*/}
            {/*                <p className="team-position">Head of Innovation</p>*/}
            {/*                <p className="team-bio">*/}
            {/*                    Leading our research initiatives and implementation of healthcare technologies.*/}
            {/*                </p>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Contact CTA Section */}
            {/*<div className="contact-section">*/}
            {/*    <div className="section-container">*/}
            {/*        <h2 className="contact-title">Ready to Experience Better Healthcare?</h2>*/}
            {/*        <p className="contact-text">*/}
            {/*            Schedule a consultation with our healthcare experts today.*/}
            {/*        </p>*/}
            {/*        <div className="contact-buttons">*/}
            {/*            <button className="primary-button">Book an Appointment</button>*/}
            {/*            <button className="secondary-button">Contact Us</button>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}


        </div>
    );
};

export default AboutUs;