import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoctorProfileCard from './DoctorProfileCard';
import '../CSS/DoctorList.css';

// Get the API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const DoctorList = ({ onDoctorSelect }) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        department: '',
        specialty: ''
    });

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);

                // Build query string from filters
                let queryParams = new URLSearchParams();
                if (filters.department) queryParams.append('department', filters.department);
                if (filters.specialty) queryParams.append('specialty', filters.specialty);

                const response = await axios.get(
                    `${API_URL}/doctors?${queryParams.toString()}`
                );

                setDoctors(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch doctors');
                setLoading(false);
                console.error(err);
            }
        };

        fetchDoctors();
    }, [filters]);

    // Get unique departments and specialties for filters
    const departments = [...new Set(doctors.map(doctor => doctor.department))].sort();
    const specialties = [...new Set(doctors.map(doctor => doctor.specialty))].sort();

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const resetFilters = () => {
        setFilters({ department: '', specialty: '' });
    };

    const handleDoctorClick = (doctor) => {
        if (onDoctorSelect) {
            onDoctorSelect(doctor);
        }
    };

    if (loading) return <div className="doctors-loading">Loading doctors...</div>;
    if (error) return <div className="doctors-error">{error}</div>;

    return (
        <div className="doctors-container">
            <h2 className="doctors-title">Our Medical Professionals</h2>

            <div className="doctors-filter">
                <div className="filter-item">
                    <label htmlFor="department">Department</label>
                    <select
                        id="department"
                        name="department"
                        value={filters.department}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Departments</option>
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-item">
                    <label htmlFor="specialty">Specialty</label>
                    <select
                        id="specialty"
                        name="specialty"
                        value={filters.specialty}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Specialties</option>
                        {specialties.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                    </select>
                </div>

                <button className="filter-reset" onClick={resetFilters}>
                    Reset Filters
                </button>
            </div>

            {doctors.length === 0 ? (
                <div className="doctors-empty">No doctors found matching your criteria</div>
            ) : (
                <div className="doctors-grid">
                    {doctors.map(doctor => (
                        <div key={doctor._id} className="doctor-grid-item">
                            <DoctorProfileCard
                                doctor={doctor}
                                onClick={() => handleDoctorClick(doctor)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DoctorList;