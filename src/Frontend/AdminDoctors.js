// src/Frontend/AdminDoctors.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../CSS/AdminDoctors.css';

const AdminDoctors = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if admin is authenticated
        const adminAuth = localStorage.getItem('adminAuth');
        if (adminAuth !== 'yes') {
            navigate('/admin/login');
        } else {
            setIsAuthenticated(true);
            fetchDoctors();
        }
    }, [navigate]);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/doctors');
            setDoctors(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch doctors');
            setLoading(false);
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        navigate('/admin/login');
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            try {
                await axios.delete(`http://localhost:5000/api/doctors/${id}`);
                // Refresh the doctors list
                fetchDoctors();
            } catch (err) {
                alert('Failed to delete doctor');
                console.error(err);
            }
        }
    };

    // Filter doctors based on search term
    const filteredDoctors = searchTerm
        ? doctors.filter(doctor =>
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : doctors;

    if (!isAuthenticated) {
        return null; // Don't render anything while checking authentication
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
                    <h1>Manage Doctors</h1>
                </div>
                <div className="admin-content">
                    <div className="admin-toolbar">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search doctors..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="search-input"
                            />
                        </div>
                        <div className="admin-actions">
                            <Link to="/register-doctor" className="add-doctor-btn">
                                Add New Doctor
                            </Link>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-indicator">Loading doctors...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : filteredDoctors.length === 0 ? (
                        <div className="no-doctors-message">
                            {searchTerm ? 'No doctors match your search' : 'No doctors found'}
                        </div>
                    ) : (
                        <div className="doctors-table-container">
                            <table className="doctors-table">
                                <thead>
                                <tr>
                                    <th>Photo</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Specialty</th>
                                    <th>Experience</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredDoctors.map(doctor => (
                                    <tr key={doctor._id}>
                                        <td>
                                            <img
                                                src={doctor.image || '/default-doctor.jpg'}
                                                alt={doctor.name}
                                                className="doctor-thumbnail"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/default-doctor.jpg';
                                                }}
                                            />
                                        </td>
                                        <td>{doctor.name}</td>
                                        <td>{doctor.department}</td>
                                        <td>{doctor.specialty}</td>
                                        <td>{doctor.yearsOfExperience} years</td>
                                        <td className="action-buttons">
                                            <Link
                                                to={`/admin/doctors/edit/${doctor._id}`}
                                                className="edit-btn"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(doctor._id)}
                                                className="delete-btn"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDoctors;