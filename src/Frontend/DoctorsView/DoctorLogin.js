import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../CSS/DoctorsCSS/DoctorLogin.css';


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const DoctorLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

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

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});
        setSuccess('');

        try {
            // Make API call with correct endpoint
            const response = await fetch(`${API_URL}/doctor/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Store token and doctor data in localStorage
                localStorage.setItem('doctorToken', data.token);

                // Your backend returns doctor data nested in data.doctor
                if (data.data && data.data.doctor) {
                    localStorage.setItem('doctorData', JSON.stringify(data.data.doctor));
                } else if (data.doctor) {
                    // Fallback if structure changes
                    localStorage.setItem('doctorData', JSON.stringify(data.doctor));
                }

                // Store remember me preference
                if (formData.rememberMe) {
                    localStorage.setItem('rememberDoctor', 'true');
                }

                setSuccess('Login successful! Redirecting to dashboard...');

                // Redirect to dashboard after 1.5 seconds
                setTimeout(() => {
                    navigate('/doctor/dashboard');
                }, 1500);
            } else {
                setErrors({ general: data.message || 'Login failed' });
            }

        } catch (error) {
            console.error('Login error:', error);
            setErrors({ general: 'Network error. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="doctor-login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-icon">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7H15L13.5 7.5C13.1 7.7 12.6 7.8 12 7.8C11.4 7.8 10.9 7.7 10.5 7.5L9 7H3V9C3 10.1 3.9 11 5 11V16.5C5 18.4 6.6 20 8.5 20S12 18.4 12 16.5V14H12V16.5C12 18.4 13.6 20 15.5 20S19 18.4 19 16.5V11C20.1 11 21 10.1 21 9Z" fill="#4A90E2"/>
                        </svg>
                    </div>
                    <h1>Doctor Login</h1>
                    <p>Welcome back! Please sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {errors.general && (
                        <div className="error-message general-error">
                            {errors.general}
                        </div>
                    )}

                    {success && (
                        <div className="success-message">
                            {success}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className={errors.email ? 'error' : ''}
                            />
                        </div>
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className={errors.password ? 'error' : ''}
                            />
                        </div>
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="form-options">
                        <label className="checkbox-container">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                            />
                            <span className="checkmark"></span>
                            Remember me
                        </label>
                        <Link to="/doctor/forgot-password" className="forgot-password">
                            Forgot Password?
                        </Link>
                    </div>

                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? (
                            <div className="loading-spinner"></div>
                        ) : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M15 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H15" stroke="white" strokeWidth="2"/>
                                    <path d="M10 17L15 12L10 7" stroke="white" strokeWidth="2"/>
                                    <path d="M15 12H3" stroke="white" strokeWidth="2"/>
                                </svg>
                                Sign In
                            </>
                        )}
                    </button>

                    <div className="signup-link">
                        <span>Don't have an account? </span>
                        <Link to="/doctor/register">Sign up here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorLogin;