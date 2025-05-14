import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './Frontend/Header';
import Footer from './Frontend/Footer';
import AboutUs from './Frontend/AboutUs';
import DoctorRegistrationForm from './Frontend/DoctorRegistrationForm';
import DoctorList from './Frontend/DoctorList';
import DoctorProfilePage from "./Frontend/DoctorProfilePage";
import TestPage from "./Frontend/TestPage";
import ScrollToTop from "./Components/ScrollToTop";
import AdminLogin from './Frontend/AdminLogin';
import AdminDashboard from './Frontend/AdminDashboard';
import AdminDoctors from './Frontend/AdminDoctors';
import EditDoctor from "./Frontend/EditDoctor";
import AdminLayout from "./Frontend/AdminLayout";
import DoctorLogin from './Frontend/DoctorsView/DoctorLogin';
import DoctorSignup from './Frontend/DoctorsView/DoctorSignup';
import DoctorDashboard from './Frontend/DoctorsView/DoctorDashboard';
import DoctorProfile from './Frontend/DoctorsView/DoctorProfile';

// Component to conditionally render layout
const LayoutWrapper = ({ children }) => {
    const location = useLocation();

    // Only exclude header/footer for doctor portal routes (not public doctor listing)
    // Doctor portal routes: /doctor/login, /doctor/register, /doctor/dashboard, /doctor/profile
    const isDoctorPortalRoute = location.pathname.startsWith('/doctor/') &&
        (location.pathname.includes('/login') ||
            location.pathname.includes('/register') ||
            location.pathname.includes('/dashboard') ||
            location.pathname.includes('/profile'));

    // If it's a doctor portal route, don't show the main header/footer
    if (isDoctorPortalRoute) {
        return <>{children}</>;
    }

    // For all other routes (including /doctors), show the main header and footer
    return (
        <>
            <Header />
            <div className="main-content">
                {children}
            </div>
            <Footer />
        </>
    );
};

function App() {
    return (
        <Router>
            <ScrollToTop />
            <div className="App">
                <LayoutWrapper>
                    <Routes>
                        <Route path="/" element={<AboutUs />} />
                        <Route path="/register-doctor" element={<DoctorRegistrationForm />} />
                        <Route path="/doctors/:id" element={<DoctorProfilePage />} />
                        <Route path="/doctors" element={<DoctorList />} />

                        {/* Doctor portal routes - these will not have main header/footer */}
                        <Route path="/doctor/login" element={<DoctorLogin />} />
                        <Route path="/doctor/register" element={<DoctorSignup />} />
                        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                        <Route path="/doctor/profile" element={<DoctorProfile />} />

                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/doctors" element={<AdminDoctors />} />
                            <Route path="/admin/doctors/edit/:id" element={<EditDoctor />} />
                        </Route>
                    </Routes>
                </LayoutWrapper>
            </div>
        </Router>
    );
}

export default App;