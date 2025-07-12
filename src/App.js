import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

import LandingPage from './LandingPage';
import HomePage from './component/HomePage';
import ProfileSetup from './component/ProfileSetup';
import UserProfile from './component/UserProfile';
import SkillSwapProposal from './component/SkillSwapProposal';
import SkillSwapRequest from './component/SkillSwapRequest';


const ProfileCheckWrapper = ({ children }) => {
  // Optional: You can add Firestore logic here
  return children;
};

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
    return <Navigate to="/profile" />;
  }

  if (requireCompleteProfile) {
    return <ProfileCheckWrapper>{children}</ProfileCheckWrapper>;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />3
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/profile/:id" element={<UserProfile />} />
      <Route path='/proposal/:id' element={<SkillSwapProposal />} />
      <Route path='/request/:id' element={<SkillSwapRequest />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div style={styles.dashboard}>Welcome to your Dashboard 🚀</div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

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
