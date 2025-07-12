<<<<<<< HEAD
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

import LandingPage from './LandingPage';
import GoogleLoginModal from './component/GoogleLoginModel';
import HomePage from './component/HomePage';

// 🔒 Wrapper to check if the user's profile is complete (You can expand this logic)
const ProfileCheckWrapper = ({ children }) => {
  // You can add Firestore profile check logic here later
  return children;
};
=======
import { Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import HomePage from './component/HomePage';
import ProfileSetup from './component/ProfileSetup';
>>>>>>> d78287fd4f52d1dfa7d98f8f093fdb8226cbf2a2

// 🔐 Protected Route component
const ProtectedRoute = ({ children, requireCompleteProfile = true }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/home" />;
  }

  if (requireCompleteProfile) {
    return <ProfileCheckWrapper>{children}</ProfileCheckWrapper>;
  }

  return children;
};

// 🧭 Main Routing
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
<<<<<<< HEAD
      <Route path="/login" element={<GoogleLoginModal />} />
      <Route path='/home' element={<HomePage />} />
      
      {/* 🔐 Example of protected route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div style={styles.dashboard}>Welcome to your Dashboard 🚀</div>
          </ProtectedRoute>
        }
      />
=======
      <Route path="/home" element={<HomePage />} />
      <Route path="/profile-setup" element={<ProfileSetup />} /> {/* New route */}
>>>>>>> d78287fd4f52d1dfa7d98f8f093fdb8226cbf2a2
    </Routes>
  );
}

// 🎨 Inline styles for loading spinner
const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20vh',
  },
  spinner: {
    width: 40,
    height: 40,
    border: '5px solid #ccc',
    borderTop: '5px solid #4285F4',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  dashboard: {
    textAlign: 'center',
    marginTop: '10vh',
    fontSize: '24px',
  },
};

export default App;
