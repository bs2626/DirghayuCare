import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../CSS/DoctorsCSS/DoctorSignup.css';

const DoctorSignup = () => {
    // Use the same API_URL pattern as the working form
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    const [formStep, setFormStep] = useState(1);
    const [formData, setFormData] = useState({
        // Personal Information
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',

        // Professional Information
        nmcNumber: '',
        specialty: '',
        department: '',
        mbbsCollege: '',
        mdCollege: '',
        yearsOfExperience: '',

        // Profile
        description: '',
        available: true,

        // Terms
        acceptTerms: false
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const specialties = [
        'Cardiology', 'Dermatology', 'Emergency Medicine', 'Endocrinology',
        'Gastroenterology', 'General Practice', 'Gynecology', 'Neurology',
        'Oncology', 'Orthopedics', 'Pediatrics', 'Psychiatry', 'Radiology',
        'Surgery', 'Urology', 'Other'
    ];

    const departments = [
        'Emergency Department', 'Internal Medicine', 'Surgery',
        'Pediatrics', 'Gynecology & Obstetrics', 'Psychiatry',
        'Radiology', 'Pathology', 'Anesthesiology', 'Cardiology',
        'Neurology', 'Orthopedics', 'Other'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Check file type
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                setErrors({
                    general: 'Please upload a JPEG or PNG image'
                });
                return;
            }

            // Check file size (2MB limit)
            if (file.size > 2 * 1024 * 1024) {
                setErrors({
                    general: 'Image size should be less than 2MB'
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

    const validateStep1 = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Full name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

        return newErrors;
    };

    const validateStep2 = () => {
        const newErrors = {};

        if (!formData.nmcNumber.trim()) newErrors.nmcNumber = 'NMC number is required';
        if (!formData.specialty) newErrors.specialty = 'Specialty is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.mbbsCollege.trim()) newErrors.mbbsCollege = 'MBBS college is required';
        if (!formData.yearsOfExperience) {
            newErrors.yearsOfExperience = 'Years of experience is required';
        } else if (formData.yearsOfExperience < 0) {
            newErrors.yearsOfExperience = 'Years of experience cannot be negative';
        }

        return newErrors;
    };

    const validateStep3 = () => {
        const newErrors = {};

        if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms and conditions';

        return newErrors;
    };

    const handleNext = () => {
        let newErrors = {};

        if (formStep === 1) {
            newErrors = validateStep1();
        } else if (formStep === 2) {
            newErrors = validateStep2();
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setFormStep(prev => prev + 1);
    };

    const handlePrevious = () => {
        setFormStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateStep3();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            // Create FormData for file upload - same as working form
            const formDataToSend = new FormData();

            // Add all fields to FormData - exactly like working form
            Object.keys(formData).forEach(key => {
                if (key === 'yearsOfExperience') {
                    formDataToSend.append(key, parseInt(formData[key], 10));
                } else if (key !== 'confirmPassword') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Add image if exists - use 'profileImage' like working form
            if (profileImage) {
                formDataToSend.append('profileImage', profileImage);
            }

            // Make API call using axios with proper headers
            const response = await axios.post(
                `${API_URL}/doctor/register`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            const data = response.data;

            if (data.success) {
                // Store token in localStorage
                localStorage.setItem('doctorToken', data.token);

                // Redirect to login page
                alert('Registration successful! You can now login.');
                window.location.href = '/doctor/login';
            } else {
                setErrors({ general: data.message || 'Registration failed' });
            }

        } catch (error) {
            console.error('Registration error:', error);
            setErrors({
                general: error.response?.data?.message || 'Registration failed. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep1 = () => (
        <div className="form-step">
            <h2>Personal Information</h2>

            <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create password"
                        className={errors.password ? 'error' : ''}
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                    <small className="password-hint">
                        Must contain at least 8 characters with uppercase, lowercase, and number
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm password"
                        className={errors.confirmPassword ? 'error' : ''}
                    />
                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="form-step">
            <h2>Professional Information</h2>

            <div className="form-group">
                <label htmlFor="nmcNumber">NMC Number</label>
                <input
                    type="text"
                    id="nmcNumber"
                    name="nmcNumber"
                    value={formData.nmcNumber}
                    onChange={handleChange}
                    placeholder="Enter your NMC registration number"
                    className={errors.nmcNumber ? 'error' : ''}
                />
                {errors.nmcNumber && <span className="error-message">{errors.nmcNumber}</span>}
                <small className="hint-text">Your Nepal Medical Council registration number</small>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="specialty">Specialty</label>
                    <select
                        id="specialty"
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleChange}
                        className={errors.specialty ? 'error' : ''}
                    >
                        <option value="">Select specialty</option>
                        {specialties.map(specialty => (
                            <option key={specialty} value={specialty}>{specialty}</option>
                        ))}
                    </select>
                    {errors.specialty && <span className="error-message">{errors.specialty}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="department">Department</label>
                    <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className={errors.department ? 'error' : ''}
                    >
                        <option value="">Select department</option>
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                    {errors.department && <span className="error-message">{errors.department}</span>}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="yearsOfExperience">Years of Experience</label>
                <input
                    type="number"
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    placeholder="Enter years of experience"
                    min="0"
                    max="50"
                    className={errors.yearsOfExperience ? 'error' : ''}
                />
                {errors.yearsOfExperience && <span className="error-message">{errors.yearsOfExperience}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="mbbsCollege">MBBS College</label>
                <input
                    type="text"
                    id="mbbsCollege"
                    name="mbbsCollege"
                    value={formData.mbbsCollege}
                    onChange={handleChange}
                    placeholder="Enter MBBS college name"
                    className={errors.mbbsCollege ? 'error' : ''}
                />
                {errors.mbbsCollege && <span className="error-message">{errors.mbbsCollege}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="mdCollege">MD College (Optional)</label>
                <input
                    type="text"
                    id="mdCollege"
                    name="mdCollege"
                    value={formData.mdCollege}
                    onChange={handleChange}
                    placeholder="Enter MD college name (if applicable)"
                />
                <small className="hint-text">Leave blank if you haven't completed MD</small>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="form-step">
            <h2>Complete Your Profile</h2>

            <div className="form-group">
                <label htmlFor="image">Profile Picture</label>
                <div className="image-upload-container">
                    <div className="image-preview">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Profile preview" />
                        ) : (
                            <div className="image-placeholder">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 6L9 17L4 12" stroke="#4A90E2" strokeWidth="2"/>
                                </svg>
                                <span>Upload Photo</span>
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input"
                    />
                    <label htmlFor="image" className="file-label">
                        Choose Photo
                    </label>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="description">Professional Description (Optional)</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell us about your experience, specializations, and what makes you unique as a doctor..."
                    rows="4"
                    maxLength="500"
                />
                <small className="hint-text">
                    {formData.description.length}/500 characters - This will be visible to patients
                </small>
            </div>

            <div className="form-group">
                <label className="checkbox-container">
                    <input
                        type="checkbox"
                        name="available"
                        checked={formData.available}
                        onChange={handleChange}
                    />
                    <span className="checkmark"></span>
                    <span>I am available for appointments</span>
                </label>
                <small className="hint-text">You can change this later in your profile settings</small>
            </div>

            <div className="form-group">
                <label className="checkbox-container terms-checkbox">
                    <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                    />
                    <span className="checkmark"></span>
                    <span className="terms-text">
                        I agree to the <Link to="/terms">Terms and Conditions</Link> and{' '}
                        <Link to="/privacy">Privacy Policy</Link>
                    </span>
                </label>
                {errors.acceptTerms && <span className="error-message">{errors.acceptTerms}</span>}
            </div>
        </div>
    );

    return (
        <div className="doctor-signup-container">
            <div className="signup-card">
                <div className="signup-header">
                    <div className="signup-icon">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                            <path d="M16 21V19C16 17.9 15.1 17 14 17H10C8.9 17 8 17.9 8 19V21" stroke="#4A90E2" strokeWidth="2"/>
                            <circle cx="12" cy="11" r="4" stroke="#4A90E2" strokeWidth="2"/>
                            <path d="M12 3L13.09 8.26L18 9L13.09 9.74L12 15L10.91 9.74L6 9L10.91 8.26L12 3Z" stroke="#4A90E2" strokeWidth="2"/>
                        </svg>
                    </div>
                    <h1>Doctor Registration</h1>
                    <p>Join our medical platform today</p>
                </div>

                <div className="progress-bar">
                    {[1, 2, 3].map(step => (
                        <div
                            key={step}
                            className={`progress-step ${formStep >= step ? 'active' : ''}`}
                        >
                            <div className="progress-circle">
                                {formStep > step ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3"/>
                                    </svg>
                                ) : (
                                    step
                                )}
                            </div>
                            <span className="progress-label">
                                {step === 1 ? 'Personal' : step === 2 ? 'Professional' : 'Profile'}
                            </span>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="signup-form">
                    {errors.general && (
                        <div className="error-message general-error">
                            {errors.general}
                        </div>
                    )}

                    {formStep === 1 && renderStep1()}
                    {formStep === 2 && renderStep2()}
                    {formStep === 3 && renderStep3()}

                    <div className="form-navigation">
                        {formStep > 1 && (
                            <button type="button" className="prev-button" onClick={handlePrevious}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                                Previous
                            </button>
                        )}

                        {formStep < 3 ? (
                            <button type="button" className="next-button" onClick={handleNext}>
                                Next
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </button>
                        ) : (
                            <button type="submit" className="submit-button" disabled={isLoading}>
                                {isLoading ? (
                                    <div className="loading-spinner"></div>
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M22 11.08V12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2C15.09 2 17.8 3.4 19.5 5.64" stroke="white" strokeWidth="2"/>
                                            <path d="M22 4L12 14.01L9 11.01" stroke="white" strokeWidth="2"/>
                                        </svg>
                                        Create Account
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    <div className="login-link">
                        <span>Already have an account? </span>
                        <Link to="/doctor/login">Sign in here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorSignup;