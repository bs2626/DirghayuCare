import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/DoctorProfileCard.css';

// This component shows a card with doctor information
// It can be used in both list views and detailed profiles
const DoctorProfileCard = ({ doctor, showDetails = false, onClick }) => {
    // Default image if doctor image is not available
    const defaultImage = '/default-doctor.jpg';
    const navigate = useNavigate();

    // Handle click on the View Profile button
    const handleViewProfile = (e) => {
        e.stopPropagation(); // Prevent the onClick of the parent div from firing
        navigate(`/doctors/${doctor._id}`);
    };
    // At the beginning of your DoctorProfileCard component
    console.log("Doctor object:", doctor);
    return (
        <div className={`doctor-card ${showDetails ? 'doctor-card-detailed' : ''}`} onClick={onClick}>
            <div className="doctor-card-image-container">

                <img
                    src={doctor.image || defaultImage}
                    onClick={handleViewProfile}
                    alt={`Dr. ${doctor.name}`}
                    className="doctor-card-image"
                    onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }}
                />


            </div>

            <div className="doctor-card-content">
                <h3 className="doctor-card-name">Dr. {doctor.name}</h3>
                <p className="doctor-card-department">{doctor.department}</p>
                <p className="doctor-card-specialty">{doctor.specialty}</p>

                {showDetails && (
                    <>
                        <p className="doctor-card-experience">
                            <span className="highlight">{doctor.yearsOfExperience}</span> years of experience
                        </p>
                        <p className="doctor-card-nmc">NMC: {doctor.nmcNumber}</p>
                    </>
                )}

                <p className="doctor-card-description">
                    {doctor.description.length > 120 && !showDetails
                        ? `${doctor.description.substring(0, 120)}...`
                        : doctor.description}
                </p>

                {showDetails && (
                    <div className="doctor-card-education">
                        <p><strong>MBBS:</strong> {doctor.mbbsCollege}</p>
                        {doctor.mdCollege && (
                            <p><strong>MD/MS:</strong> {doctor.mdCollege}</p>
                        )}
                    </div>
                )}

                {!showDetails && (
                    <button
                        className="doctor-card-btn"
                        onClick={handleViewProfile}
                    >
                        View Profile
                    </button>
                )}
            </div>
        </div>
    );
};

export default DoctorProfileCard;