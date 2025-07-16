import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GoogleLoginModal.css';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const GoogleLoginModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkProfileAndRedirect = async (user) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();

     const isComplete =
  data.name?.trim() &&
  Array.isArray(data.skillsOffered) && data.skillsOffered.length > 0 &&
  Array.isArray(data.skillsWanted) && data.skillsWanted.length > 0 &&
  data.availability?.trim();

      toast.success('Login successful!');

      navigate(isComplete ? '/home' : '/profile-setup');
    } else {
      const {
        displayName,
        email,
        photoURL,
        phoneNumber,
        emailVerified,
        providerData,
        metadata,
      } = user;

      const providerId = providerData?.[0]?.providerId || 'google';

      await setDoc(userRef, {
        name: displayName || '',
        email: email || '',
        photoURL: photoURL || '',
        phoneNumber: phoneNumber || '',
        emailVerified: emailVerified || false,
        provider: providerId,
        createdAt: metadata?.creationTime || new Date().toISOString(),
        lastLogin: metadata?.lastSignInTime || '',
      });

      toast.info('Please complete your profile');
      navigate('/profile-setup');
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await checkProfileAndRedirect(user);
      onClose();
    } catch (err) {
      console.error('Google Login Error:', err);
      toast.error('Login failed. Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Sign in to SkillSwap</h2>
        <p>Continue with Google to connect with others!</p>
        <button className="google-login-btn" onClick={handleLogin} disabled={loading}>
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="G" />
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>
      </div>
    </div>
  );
};

export default GoogleLoginModal;
