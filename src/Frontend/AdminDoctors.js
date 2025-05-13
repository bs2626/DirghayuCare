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
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [doctorsPerPage] = useState(10);
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [doctorToDelete, setDoctorToDelete] = useState(null);
    const [selectedDoctors, setSelectedDoctors] = useState([]);

    const API_URL = process.env.REACT_APP_API_URL || '/api';

    // Debug API URL
    useEffect(() => {
        console.log('API_URL configured as:', API_URL);
    }, []);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);

            // Get admin token from localStorage
            const adminAuth = localStorage.getItem('adminAuth');
            const adminToken = localStorage.getItem('adminToken');

            console.log('Admin auth status:', adminAuth);
            console.log('Admin token exists:', !!adminToken);

            // Create axios config with headers if needed
            const config = {};
            if (adminToken) {
                config.headers = {
                    'Authorization': `Bearer ${adminToken}`
                };
            }

            const response = await axios.get(`${API_URL}/doctors`, config);
            setDoctors(response.data.data || []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch doctors');
            console.error('Fetch doctors error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Filter and search doctors
    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = searchTerm === '' ||
            doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.department?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDepartment = departmentFilter === '' || doctor.department === departmentFilter;

        return matchesSearch && matchesDepartment;
    });

    // Sort doctors
    const sortedDoctors = [...filteredDoctors].sort((a, b) => {
        let aValue = a[sortField] || '';
        let bValue = b[sortField] || '';

        // Handle numeric fields
        if (sortField === 'yearsOfExperience') {
            aValue = parseInt(aValue) || 0;
            bValue = parseInt(bValue) || 0;
        }

        if (sortDirection === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
    });

    // Pagination
    const indexOfLastDoctor = currentPage * doctorsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
    const currentDoctors = sortedDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
    const totalPages = Math.ceil(sortedDoctors.length / doctorsPerPage);

    // Get unique departments for filter
    const departments = [...new Set(doctors.map(doctor => doctor.department).filter(Boolean))];

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleDelete = async (doctorId) => {
        try {
            // Get admin token from localStorage
            const adminAuth = localStorage.getItem('adminAuth');
            const adminToken = localStorage.getItem('adminToken');

            console.log('Attempting to delete doctor:', doctorId);
            console.log('API URL:', API_URL);
            console.log('Admin auth status:', adminAuth);
            console.log('Admin token exists:', !!adminToken);

            // Create axios config with authentication headers
            const config = {};

            // For your setup, let's try multiple authentication approaches
            if (adminToken) {
                config.headers = {
                    'Authorization': `Bearer ${adminToken}`
                };
            } else if (adminAuth === 'yes') {
                // Try both approaches in case backend expects different headers
                config.headers = {
                    'X-Admin-Auth': 'yes',
                    'Admin-Authenticated': 'true'
                };
            }

            // Also add any cookies if your backend uses session-based auth
            config.withCredentials = true;

            console.log('Request config:', config);

            // Full URL for debugging
            const fullUrl = `${API_URL}/doctors/${doctorId}`;
            console.log('Full delete URL:', fullUrl);

            const response = await axios.delete(fullUrl, config);

            console.log('Delete response:', response);

            // Check if the response is successful
            if (response.status === 200 || response.status === 204) {
                // Update the state to remove the deleted doctor
                setDoctors(doctors.filter(doctor => doctor._id !== doctorId));
                setShowDeleteModal(false);
                setDoctorToDelete(null);

                // Show success message
                alert('Doctor deleted successfully');
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (err) {
            console.error('Error deleting doctor:', err);

            // More specific error messages
            let errorMessage = 'Failed to delete doctor';

            if (err.response) {
                // The request was made and the server responded with a status code
                console.error('Error response status:', err.response.status);
                console.error('Error response data:', err.response.data);
                console.error('Error response headers:', err.response.headers);

                // Check if there's a specific error message from the server
                if (err.response.data && err.response.data.error) {
                    console.error('Server error details:', err.response.data.error);
                }

                if (err.response.status === 401) {
                    errorMessage = 'Authentication failed. Please log in again.';
                    // Redirect to login page
                    localStorage.removeItem('adminAuth');
                    localStorage.removeItem('adminToken');
                    navigate('/admin/login');
                } else if (err.response.status === 403) {
                    errorMessage = 'You do not have permission to delete doctors.';
                } else if (err.response.status === 404) {
                    errorMessage = 'Doctor not found. It may have already been deleted.';
                } else if (err.response.status === 500) {
                    // For 500 errors, provide more information
                    const serverError = err.response.data?.error || err.response.data?.message || 'Internal server error';
                    errorMessage = `Server error: ${serverError}. 
                    
                    This could be due to:
                    1. Backend authentication middleware issue
                    2. Database connection problem
                    3. Invalid doctor ID format
                    4. Missing required headers
                    
                    Please check the server logs for more details.`;
                } else {
                    errorMessage = `Error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`;
                }
            } else if (err.request) {
                // The request was made but no response was received
                console.error('No response received:', err.request);
                errorMessage = 'No response from server. Please check your connection.';
            } else {
                // Something happened in setting up the request
                console.error('Request setup error:', err.message);
                errorMessage = `Request error: ${err.message}`;
            }

            alert(errorMessage);
        }
    };

    const handleSelectDoctor = (doctorId) => {
        setSelectedDoctors(prev => {
            if (prev.includes(doctorId)) {
                return prev.filter(id => id !== doctorId);
            } else {
                return [...prev, doctorId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedDoctors.length === currentDoctors.length) {
            setSelectedDoctors([]);
        } else {
            setSelectedDoctors(currentDoctors.map(doctor => doctor._id));
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${selectedDoctors.length} doctors?`)) {
            try {
                await Promise.all(selectedDoctors.map(id =>
                    axios.delete(`${API_URL}/doctors/${id}`)
                ));
                setDoctors(doctors.filter(doctor => !selectedDoctors.includes(doctor._id)));
                setSelectedDoctors([]);
            } catch (err) {
                alert('Error deleting doctors');
                console.error(err);
            }
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading doctors...</p>
            </div>
        );
    }

    return (
        <div className="admin-doctors">
            <div className="doctors-header">
                <h1>Manage Doctors</h1>
                <Link to="/register-doctor" className="add-doctor-btn">
                    <span className="btn-icon">+</span>
                    Add New Doctor
                </Link>
            </div>

            <div className="doctors-controls">
                <div className="search-filter-container">
                    <input
                        type="text"
                        placeholder="Search doctors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Departments</option>
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>

                {selectedDoctors.length > 0 && (
                    <div className="bulk-actions">
                        <span className="selected-count">
                            {selectedDoctors.length} selected
                        </span>
                        <button onClick={handleBulkDelete} className="bulk-delete-btn">
                            Delete Selected
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            )}

            <div className="doctors-table-container">
                {/* Desktop Table View */}
                <div className="desktop-view">
                    <table className="doctors-table">
                        <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={selectedDoctors.length === currentDoctors.length && currentDoctors.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th>Photo</th>
                            <th onClick={() => handleSort('name')} className="sortable">
                                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('department')} className="sortable">
                                Department {sortField === 'department' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('specialty')} className="sortable">
                                Specialty {sortField === 'specialty' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('yearsOfExperience')} className="sortable">
                                Experience {sortField === 'yearsOfExperience' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentDoctors.map(doctor => (
                            <tr key={doctor._id} className={selectedDoctors.includes(doctor._id) ? 'selected' : ''}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedDoctors.includes(doctor._id)}
                                        onChange={() => handleSelectDoctor(doctor._id)}
                                    />
                                </td>
                                <td>
                                    <div className="doctor-photo">
                                        {doctor.image || doctor.profileImage ? (
                                            <img
                                                src={doctor.image || doctor.profileImage}
                                                alt={doctor.name}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div className="photo-placeholder" style={{ display: doctor.image || doctor.profileImage ? 'none' : 'flex' }}>
                                            {doctor.name?.charAt(0) || '?'}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="doctor-name">
                                        <span className="name">{doctor.name}</span>
                                        <span className="id">ID: {doctor._id?.slice(-6)}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className="department-badge">{doctor.department}</span>
                                </td>
                                <td>{doctor.specialty}</td>
                                <td>{doctor.yearsOfExperience} years</td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            onClick={() => navigate(`/doctors/${doctor._id}`)}
                                            className="action-btn view-btn"
                                            title="View"
                                        >
                                            👁️
                                        </button>
                                        <button
                                            onClick={() => navigate(`/admin/doctors/edit/${doctor._id}`)}
                                            className="action-btn edit-btn"
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDoctorToDelete(doctor);
                                                setShowDeleteModal(true);
                                            }}
                                            className="action-btn delete-btn"
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="mobile-view">
                    {currentDoctors.map(doctor => (
                        <div key={doctor._id} className={`doctor-card ${selectedDoctors.includes(doctor._id) ? 'selected' : ''}`}>
                            <div className="card-header">
                                <input
                                    type="checkbox"
                                    checked={selectedDoctors.includes(doctor._id)}
                                    onChange={() => handleSelectDoctor(doctor._id)}
                                    className="card-checkbox"
                                />
                                <div className="doctor-photo">
                                    {doctor.image || doctor.profileImage ? (
                                        <img
                                            src={doctor.image || doctor.profileImage}
                                            alt={doctor.name}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className="photo-placeholder" style={{ display: doctor.image || doctor.profileImage ? 'none' : 'flex' }}>
                                        {doctor.name?.charAt(0) || '?'}
                                    </div>
                                </div>
                                <div className="card-info">
                                    <h3 className="doctor-name">{doctor.name}</h3>
                                    <p className="doctor-id">ID: {doctor._id?.slice(-6)}</p>
                                </div>
                            </div>

                            <div className="card-body">
                                <div className="card-details">
                                    <div className="detail-item">
                                        <span className="label">Department:</span>
                                        <span className="department-badge">{doctor.department}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Specialty:</span>
                                        <span className="value">{doctor.specialty}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Experience:</span>
                                        <span className="value">{doctor.yearsOfExperience} years</span>
                                    </div>
                                </div>
                            </div>

                            <div className="card-actions">
                                <button
                                    onClick={() => navigate(`/doctors/${doctor._id}`)}
                                    className="action-btn view-btn"
                                >
                                    <span className="btn-icon">👁️</span>
                                    View
                                </button>
                                <button
                                    onClick={() => navigate(`/admin/doctors/edit/${doctor._id}`)}
                                    className="action-btn edit-btn"
                                >
                                    <span className="btn-icon">✏️</span>
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        setDoctorToDelete(doctor);
                                        setShowDeleteModal(true);
                                    }}
                                    className="action-btn delete-btn"
                                >
                                    <span className="btn-icon">🗑️</span>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {sortedDoctors.length === 0 && !loading && (
                <div className="no-doctors">
                    <p>No doctors found{searchTerm && ` for "${searchTerm}"`}</p>
                </div>
            )}

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                    >
                        Previous
                    </button>

                    <div className="pagination-info">
                        Page {currentPage} of {totalPages}
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="pagination-btn"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete Dr. {doctorToDelete?.name}?</p>
                        <div className="modal-actions">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(doctorToDelete._id)}
                                className="confirm-delete-btn"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDoctors;