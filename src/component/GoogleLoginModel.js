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
        data.teachSkill?.trim() &&
        data.learnSkill?.trim() &&
        data.college?.trim() &&
        data.year?.trim() &&
        data.bio?.trim();

      toast.success('Login successful!');

      if (isComplete) {
        navigate('/home');
      } else {
        navigate('/profile-setup');
      }
    } else {
      // Create empty user data if doesn't exist
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
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
