import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
    return (
        <Router>
            <ScrollToTop />
            <div className="App">
                {/* The Header will now appear on all pages */}
                <Header />

                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<AboutUs />} />
                        <Route path="/register-doctor" element={<DoctorRegistrationForm />} />
                        <Route path="/doctors/:id" element={<DoctorProfilePage />} />
                        <Route path="/doctors" element={<DoctorList />} />
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/doctors" element={<AdminDoctors />} />
                        <Route path="/admin/doctors/edit/:id" element={<EditDoctor />} />


                    </Routes>
                </div>

                {/* You can also include the Footer on all pages */}
                <Footer />
            </div>
        </Router>
    );
}

export default App;