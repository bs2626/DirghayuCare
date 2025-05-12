// src/Frontend/EditDoctor.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../CSS/EditDoctor.css';

const EditDoctor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [doctorData, setDoctorData] = useState({
        name: '',
        nmcNumber: '',
        department: '',
        mbbsCollege: '',
        mdCollege: '',
        yearsOfExperience: '',
        specialty: '',
        description: '',
        available: true
    });
    const [profileImage, setProfileImage] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL || '/api';


    useEffect(() => {
        // Check if admin is authenticated
        const adminAuth = localStorage.getItem('adminAuth');
        if (adminAuth !== 'yes') {
            navigate('/admin/login');
        } else {
            setIsAuthenticated(true);
            fetchDoctorData();
        }
    }, [id, navigate]);

    const fetchDoctorData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${API_URL}/doctors/${id}`
            );
            const doctor = response.data.data;

            setDoctorData({
                name: doctor.name || '',
                nmcNumber: doctor.nmcNumber || '',
                department: doctor.department || '',
                mbbsCollege: doctor.mbbsCollege || '',
                mdCollege: doctor.mdCollege || '',
                yearsOfExperience: doctor.yearsOfExperience || '',
                specialty: doctor.specialty || '',
                description: doctor.description || '',
                available: doctor.available !== undefined ? doctor.available : true
            });

            setPreviewImage(doctor.image);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch doctor data');
            setLoading(false);
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDoctorData({
            ...doctorData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                alert('Please upload a valid image file (JPG or PNG)');
                return;
            }

            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('Image size should be less than 2MB');
                return;
            }

            setProfileImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            // Create form data for multipart/form-data submission
            const formData = new FormData();

            // Add all fields to formData
            Object.keys(doctorData).forEach(key => {
                if (key === 'yearsOfExperience') {
                    formData.append(key, parseInt(doctorData[key], 10));
                } else {
                    formData.append(key, doctorData[key]);
                }
            });

            // Add image if selected
            if (profileImage) {
                formData.append('profileImage', profileImage);
            }

            // Send the update request
            await axios.put(`http://localhost:5000/api/doctors/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccess(true);
            setLoading(false);

            // Redirect after a short delay
            setTimeout(() => {
                navigate('/admin/doctors');
            }, 2000);

        } catch (err) {
            setError('Failed to update doctor: ' + (err.response?.data?.error || err.message));
            setLoading(false);
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        navigate('/admin/login');
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2>Admin Panel</h2>
                </div>
                <nav className="admin-nav">
                    <Link to="/admin/dashboard" className="admin-nav-link">
                        Dashboard
                    </Link>
                    <Link to="/admin/doctors" className="admin-nav-link active">
                        Manage Doctors
                    </Link>
                    <button onClick={handleLogout} className="admin-logout-btn">
                        Logout
                    </button>
                </nav>
            </div>
            <div className="admin-main">
                <div className="admin-header">
                    <h1>Edit Doctor</h1>
                </div>
                <div className="admin-content">
                    {loading && !error ? (
                        <div className="loading-indicator">Loading doctor data...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : (
                        <form onSubmit={handleSubmit} className="edit-doctor-form">
                            {success && (
                                <div className="success-message">
                                    Doctor profile updated successfully! Redirecting...
                                </div>
                            )}

                            <div className="form-grid">
                                <div className="form-column">
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={doctorData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="nmcNumber">NMC Number</label>
                                        <input
                                            type="text"
                                            id="nmcNumber"
                                            name="nmcNumber"
                                            value={doctorData.nmcNumber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="department">Department</label>
                                        <select
                                            id="department"
                                            name="department"
                                            value={doctorData.department}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Department</option>
                                            <option value="Cardiology">Cardiology</option>
                                            <option value="Dermatology">Dermatology</option>
                                            <option value="Endocrinology">Endocrinology</option>
                                            <option value="Gastroenterology">Gastroenterology</option>
                                            <option value="General Medicine">General Medicine</option>
                                            <option value="Neurology">Neurology</option>
                                            <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
                                            <option value="Oncology">Oncology</option>
                                            <option value="Ophthalmology">Ophthalmology</option>
                                            <option value="Orthopedics">Orthopedics</option>
                                            <option value="Pediatrics">Pediatrics</option>
                                            <option value="Psychiatry">Psychiatry</option>
                                            <option value="Pulmonology">Pulmonology</option>
                                            <option value="Radiology">Radiology</option>
                                            <option value="Urology">Urology</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="specialty">Specialty</label>
                                        <input
                                            type="text"
                                            id="specialty"
                                            name="specialty"
                                            value={doctorData.specialty}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="yearsOfExperience">Years of Experience</label>
                                        <input
                                            type="number"
                                            id="yearsOfExperience"
                                            name="yearsOfExperience"
                                            value={doctorData.yearsOfExperience}
                                            onChange={handleChange}
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-column">
                                    <div className="form-group">
                                        <label htmlFor="mbbsCollege">MBBS College</label>
                                        <input
                                            type="text"
                                            id="mbbsCollege"
                                            name="mbbsCollege"
                                            value={doctorData.mbbsCollege}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="mdCollege">MD College (if applicable)</label>
                                        <input
                                            type="text"
                                            id="mdCollege"
                                            name="mdCollege"
                                            value={doctorData.mdCollege}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="available">Available for Appointments</label>
                                        <div className="checkbox-wrapper">
                                            <input
                                                type="checkbox"
                                                id="available"
                                                name="available"
                                                checked={doctorData.available}
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="available" className="checkbox-label">
                                                Doctor is available for new appointments
                                            </label>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="profileImage">Profile Image</label>
                                        <div className="image-upload-container">
                                            {previewImage && (
                                                <div className="image-preview">
                                                    <img src={previewImage} alt="Doctor Preview" />
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                id="profileImage"
                                                name="profileImage"
                                                onChange={handleImageChange}
                                                className="file-input"
                                                accept="image/jpeg,image/png,image/jpg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="description">Professional Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={doctorData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    required
                                    maxLength="500"
                                ></textarea>
                                <div className="char-count">
                                    {doctorData.description.length}/500 characters
                                </div>
                            </div>

                            <div className="form-actions">
                                <Link to="/admin/doctors" className="cancel-btn">
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    className="save-btn"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditDoctor;