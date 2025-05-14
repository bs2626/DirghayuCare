import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorLayout from './DoctorLayout';
import '../../CSS/DoctorsCSS/DoctorProfile.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const DoctorProfile = () => {
    const [doctorData, setDoctorData] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('doctorToken');
        if (!token) {
            navigate('/doctor/login');
            return;
        }

        const savedDoctor = localStorage.getItem('doctorData');
        if (savedDoctor && savedDoctor !== 'undefined') {
            try {
                const doctor = JSON.parse(savedDoctor);
                setDoctorData(doctor);
                setFormData({
                    name: doctor.name || '',
                    email: doctor.email || '',
                    phone: doctor.phone || '',
                    specialty: doctor.specialty || '',
                    department: doctor.department || '',
                    mbbsCollege: doctor.mbbsCollege || '',
                    mdCollege: doctor.mdCollege || '',
                    yearsOfExperience: doctor.yearsOfExperience || 0,
                    description: doctor.description || '',
                    image: doctor.image || ''
                });
                setImagePreview(doctor.image || '');
                setLoading(false);
            } catch (error) {
                console.error('Error parsing doctor data:', error);
                navigate('/doctor/login');
            }
        } else {
            navigate('/doctor/login');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Store file for upload
            setFormData(prev => ({
                ...prev,
                imageFile: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('doctorToken');
            const formDataToSend = new FormData();

            // Append all form fields
            Object.keys(formData).forEach(key => {
                if (key !== 'imageFile') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Append image file if exists
            if (formData.imageFile) {
                formDataToSend.append('image', formData.imageFile);
            }

            const response = await fetch(`${API_URL}/doctor/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Update localStorage with new data - your backend returns data.data.doctor
                const updatedDoctor = data.data.doctor;
                localStorage.setItem('doctorData', JSON.stringify(updatedDoctor));
                setDoctorData(updatedDoctor);
                setSuccess('Profile updated successfully!');

                // Redirect back to dashboard after 2 seconds
                setTimeout(() => {
                    navigate('/doctor/dashboard');
                }, 2000);
            } else {
                setError(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            setError('Network error. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DoctorLayout>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </DoctorLayout>
        );
    }

    return (
        <DoctorLayout>
            <div className="profile-container">
                <div className="profile-header">
                    <h1>Edit Profile</h1>
                    <button
                        className="back-btn"
                        onClick={() => navigate('/doctor/dashboard')}
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit} className="profile-form">
                    {/* Profile Image Section */}
                    <div className="image-section">
                        <div className="image-upload">
                            <img
                                src={imagePreview || "https://media.istockphoto.com/id/1494498902/vector/a-female-doctor-with-a-stethoscope.jpg"}
                                alt="Doctor profile"
                                className="profile-image-preview"
                            />
                            <div className="image-upload-overlay">
                                <label htmlFor="imageUpload" className="image-upload-btn">
                                    📷 Change Photo
                                </label>
                                <input
                                    type="file"
                                    id="imageUpload"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="specialty">Specialty</label>
                            <input
                                type="text"
                                id="specialty"
                                name="specialty"
                                value={formData.specialty}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="department">Department</label>
                            <input
                                type="text"
                                id="department"
                                name="department"
                                value={formData.department}
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
                                value={formData.yearsOfExperience}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="mbbsCollege">MBBS College</label>
                            <input
                                type="text"
                                id="mbbsCollege"
                                name="mbbsCollege"
                                value={formData.mbbsCollege}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="mdCollege">MD College (Optional)</label>
                            <input
                                type="text"
                                id="mdCollege"
                                name="mdCollege"
                                value={formData.mdCollege}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                maxLength="500"
                                placeholder="Brief description about yourself and your practice..."
                            />
                            <small>{formData.description.length}/500 characters</small>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="profile-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate('/doctor/dashboard')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="save-btn"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </DoctorLayout>
    );
};

export default DoctorProfile;