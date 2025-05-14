import React from 'react';
import DoctorHeader from './DoctorHeader';
import DoctorFooter from './DoctorFooter';
import '../../CSS/DoctorsCSS/DoctorLayout.css';

const DoctorLayout = ({ children }) => {
    return (
        <div className="doctor-layout">
            <DoctorHeader />
            <main className="main-content">
                {children}
            </main>
            <DoctorFooter />
        </div>
    );
};

export default DoctorLayout;