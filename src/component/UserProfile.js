import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import './UserProfile.css';
import GoogleLoginModal from './GoogleLoginModel';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user] = useAuthState(auth);

  const currentUserId = id || user?.uid;
  const isCurrentUser = !id || id === user?.uid;

  useEffect(() => {
    if (!currentUserId) return;

    const fetchUserData = async () => {
      try {
        const userDoc = doc(db, 'users', currentUserId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data());
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUserId]);

  const handleRequest = () => {
    if (user) {
      navigate(`/request/${currentUserId}`);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (!userData) return <div className="error">User not found</div>;

  return (
    <div className="user-profile">
      <img src={userData.photoURL} alt={`${userData.name}'s profile`} className="profile-photo" />
      <h2>{userData.name}</h2>

      <div className="skills">
        <div className="skills-offered">
          <h3>Skills Offered</h3>
          {userData.skillsOffered?.length ? (
            <ul>{userData.skillsOffered.map((skill, i) => <li key={i}>{skill}</li>)}</ul>
          ) : <p>No skills offered</p>}
        </div>
        <div className="skills-wanted">
          <h3>Skills Wanted</h3>
          {userData.skillsWanted?.length ? (
            <ul>{userData.skillsWanted.map((skill, i) => <li key={i}>{skill}</li>)}</ul>
          ) : <p>No skills wanted</p>}
        </div>
      </div>

      <div className="rating">
        <h3>Rating</h3>
        <p>{userData.rating ? `${userData.rating} / 5` : 'No rating yet'}</p>
      </div>

      <div className="feedback">
        <h3>Feedback</h3>
        {userData.feedback?.length ? (
          userData.feedback.map((fb, i) => (
            <div key={i} className="feedback-item">
              <p>{fb.text}</p>
              <p>- {fb.reviewer}</p>
            </div>
          ))
        ) : <p>No feedback yet</p>}
      </div>

      {id && (
        <button onClick={handleRequest} className="request-btn">
          <i className="fas fa-paper-plane"></i> Request
        </button>
      )}

      {isCurrentUser && (
        <button onClick={handleLogout} className="logout-btn">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      )}

      {showLoginModal && (
        <GoogleLoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
};

export default UserProfile;
