// src/Frontend/AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CSS/AdminLogin.css';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // For now, let's use a basic authentication
            // In production, you'd call your backend API
            if (credentials.email === 'admin@dirghayucare.com' && credentials.password === 'admin123') {
                // Success - store a simple auth token
                localStorage.setItem('adminAuth', 'yes');
                setLoading(false);
                navigate('/admin/dashboard');
            } else {
                setError('Invalid email or password');
                setLoading(false);
            }
        } catch (err) {
            setError('Login failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <h2 className="admin-login-title">Admin Login</h2>
                <p className="admin-login-subtitle">Please enter your credentials to access the admin dashboard</p>

                {error && <div className="admin-login-error">{error}</div>}

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            required
                            placeholder="admin@dirghayucare.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="admin-login-button"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;