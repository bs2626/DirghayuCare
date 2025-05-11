import React, { useState } from 'react';
import axios from 'axios';
import '../CSS/DoctorRegistrationForm.css';

// Get the API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const DoctorRegistrationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        nmcNumber: '',
        department: '',
        mbbsCollege: '',
        mdCollege: '',
        yearsOfExperience: '',
        specialty: '',
        description: ''
    });

    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [status, setStatus] = useState({
        loading: false,
        success: false,
        error: null
    });

    const {
        name,
        nmcNumber,
        department,
        mbbsCollege,
        mdCollege,
        yearsOfExperience,
        specialty,
        description
    } = formData;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Check file type
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                setStatus({
                    loading: false,
                    success: false,
                    error: 'Please upload a JPEG or PNG image'
                });
                return;
            }

            // Check file size (2MB limit)
            if (file.size > 2 * 1024 * 1024) {
                setStatus({
                    loading: false,
                    success: false,
                    error: 'Image size should be less than 2MB'
                });
                return;
            }

            setProfileImage(file);

            // Create a preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: null });

        try {
            // Create FormData object for file upload
            const formDataToSend = new FormData();

            // Add all text fields
            Object.keys(formData).forEach(key => {
                // Convert yearsOfExperience to number
                if (key === 'yearsOfExperience') {
                    formDataToSend.append(key, parseInt(formData[key], 10));
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Add image if exists
            if (profileImage) {
                formDataToSend.append('profileImage', profileImage);
            }

            // Send the request to the API
            const response = await axios.post(
                `${API_URL}/doctors`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setStatus({ loading: false, success: true, error: null });

            // Reset form after successful submission
            setFormData({
                name: '',
                nmcNumber: '',
                department: '',
                mbbsCollege: '',
                mdCollege: '',
                yearsOfExperience: '',
                specialty: '',
                description: ''
            });
            setProfileImage(null);
            setImagePreview(null);

        } catch (error) {
            setStatus({
                loading: false,
                success: false,
                error: error.response?.data?.error || 'Something went wrong'
            });
        }
    };

    return (
        <div className="doctor-registration-container">
            <div className="doctor-registration-card">
                <h2 className="form-title">Doctor Registration</h2>
                <p className="form-subtitle">Please fill in your professional details</p>

                {status.success && (
                    <div className="success-message">
                        Your profile has been registered successfully!
                    </div>
                )}

                {status.error && (
                    <div className="error-message">
                        {typeof status.error === 'string'
                            ? status.error
                            : Array.isArray(status.error)
                                ? status.error.join(', ')
                                : 'An error occurred'}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="registration-form">


                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={handleChange}
                            required
                            placeholder="Dr. Full Name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="nmcNumber">NMC Number</label>
                        <input
                            type="text"
                            id="nmcNumber"
                            name="nmcNumber"
                            value={nmcNumber}
                            onChange={handleChange}
                            required
                            placeholder="Your NMC Registration Number"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="department">Department</label>
                        <select
                            id="department"
                            name="department"
                            value={department}
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
                        <label htmlFor="mbbsCollege">MBBS College</label>
                        <input
                            type="text"
                            id="mbbsCollege"
                            name="mbbsCollege"
                            value={mbbsCollege}
                            onChange={handleChange}
                            required
                            placeholder="College where you completed MBBS"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="mdCollege">MD College (if applicable)</label>
                        <input
                            type="text"
                            id="mdCollege"
                            name="mdCollege"
                            value={mdCollege}
                            onChange={handleChange}
                            placeholder="College where you completed MD/MS"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="yearsOfExperience">Years of Experience</label>
                        <input
                            type="number"
                            id="yearsOfExperience"
                            name="yearsOfExperience"
                            value={yearsOfExperience}
                            onChange={handleChange}
                            required
                            min="0"
                            placeholder="Total years of professional experience"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="specialty">Specialty</label>
                        <input
                            type="text"
                            id="specialty"
                            name="specialty"
                            value={specialty}
                            onChange={handleChange}
                            required
                            placeholder="Your medical specialty"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Professional Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={description}
                            onChange={handleChange}
                            required
                            rows="4"
                            placeholder="A short description of your professional experience and expertise"
                            maxLength="500"
                        ></textarea>
                        <small>{description.length}/500 characters</small>
                    </div>

                    <div className="form-group image-upload-group">
                        <label htmlFor="profileImage">Profile Image</label>
                        <input
                            type="file"
                            id="profileImage"
                            name="profileImage"
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={handleImageChange}
                            className="file-input"
                        />
                        {imagePreview && (
                            <div className="image-preview">
                                <img src={imagePreview} alt="Profile preview" />
                            </div>
                        )}
                        <small>Upload a professional photo (JPEG or PNG, Max size: 2MB)</small>
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={status.loading}
                    >
                        {status.loading ? 'Submitting...' : 'Register as Doctor'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DoctorRegistrationForm;