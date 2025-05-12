import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../CSS/DoctorProfilePage.css';

const DoctorProfilePage = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL || '/api';

    // Log the ID to debug
    console.log("Doctor ID from URL params:", id);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                setLoading(true);


                const response = await axios.get(
                    `${API_URL}/doctors/${id}`
                );


                setDoctor(response.data.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching doctor:", err);
                setError("Failed to load doctor details: " + (err.message || "Unknown error"));
                setLoading(false);
            }
        };

        if (id) {
            fetchDoctor();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="doctor-profile-loading">
                <div className="loading-spinner"></div>
                <p>Loading doctor profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="doctor-profile-error">
                <div className="error-icon">!</div>
                <h2>Error Loading Profile</h2>
                <p>{error}</p>
                <Link to="/doctors" className="back-link">Return to Doctors List</Link>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="doctor-profile-not-found">
                <div className="not-found-icon">?</div>
                <h2>Doctor Not Found</h2>
                <p>We couldn't find a doctor with ID: {id}</p>
                <Link to="/doctors" className="back-link">Return to Doctors List</Link>
            </div>
        );
    }

    return (
        <div className="doctor-profile-page">
            <div className="doctor-profile-header">
                <Link to="/doctors" className="back-link">
                    <span className="back-arrow">←</span> Back to Doctors
                </Link>
            </div>

            <div className="doctor-profile-main">
                <div className="doctor-profile-sidebar">
                    <div className="doctor-profile-image">
                        <img
                            src={doctor.image || '/default-doctor.jpg'}
                            alt={`Dr. ${doctor.name}`}
                            onError={(e) => { e.target.onerror = null; e.target.src = '/default-doctor.jpg'; }}
                        />
                    </div>

                    <div className="doctor-profile-quick-info">
                        <div className="info-item">
                            <span className="info-label">Department</span>
                            <span className="info-value">{doctor.department}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Specialty</span>
                            <span className="info-value">{doctor.specialty}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Experience</span>
                            <span className="info-value">{doctor.yearsOfExperience} years</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">NMC Number</span>
                            <span className="info-value">{doctor.nmcNumber}</span>
                        </div>
                    </div>

                </div>

                <div className="doctor-profile-content">
                    <h1 className="doctor-name">Dr. {doctor.name}</h1>

                    <section className="profile-section about-section">
                        <h2 className="section-title">About Dr. {doctor.name}</h2>
                        <p className="doctor-description">{doctor.description}</p>
                    </section>

                    <section className="profile-section education-section">
                        <h2 className="section-title">Education & Training</h2>
                        <div className="education-items">
                            <div className="education-item">
                                <div className="education-icon">🎓</div>
                                <div className="education-details">
                                    <h3>MBBS</h3>
                                    <p>{doctor.mbbsCollege}</p>
                                </div>
                            </div>

                            {doctor.mdCollege && (
                                <div className="education-item">
                                    <div className="education-icon">🎓</div>
                                    <div className="education-details">
                                        <h3>MD/MS</h3>
                                        <p>{doctor.mdCollege}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/*<section className="profile-section services-section">*/}
                    {/*    <h2 className="section-title">Services Offered</h2>*/}
                    {/*    <ul className="services-list">*/}
                    {/*        <li>Consultations</li>*/}
                    {/*        <li>Preventive Care</li>*/}
                    {/*        <li>Specialized Treatment in {doctor.specialty}</li>*/}
                    {/*        <li>Follow-up Care</li>*/}
                    {/*        <li>Health Education and Counseling</li>*/}
                    {/*    </ul>*/}
                    {/*</section>*/}
                </div>
            </div>
        </div>
    );
};

export default DoctorProfilePage;