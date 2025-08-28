import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Signin from './components/signin/Signin';
import Navbar from './components/navbar/Navbar';
import Home from './components/homepage/Home';
import Activerequest from './components/activerequest/Activerequest';
import Pastrequest from './components/pastrequest/Pastrequest';
// import Contact from './components/contact/Contact';
import Signup from './components/signup/Signup';
import Profile from './components/profile/Profile';
import OTPVerification from './components/signup/OTPverification';

function AppContent() {
  const location = useLocation();

  // Ensure the path exactly matches (case-sensitive)
  const noNavbarRoutes = ["/OTPVerification", "/signin", "/signup"];

  return (
    <>
      <Toaster /> {/* Toast notifications support */}

      {/* Hide Navbar for specific routes */}
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/OTPVerification" element={<OTPVerification />} />
        <Route path="/activerequest" element={<Activerequest />} />
        <Route path="/pastrequest" element={<Pastrequest />} />
        {/* <Route path="/contact" element={<Contact />} /> */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;