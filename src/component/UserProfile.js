import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import './UserProfile.css';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = doc(db, 'users', id);
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
  }, [id]);

  const handleRequest = () => {
    if (user) {
      navigate(`/request/${id}`);
    } else {
      setShowLoginModal(true);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!userData) {
    return <div className="error">User not found</div>;
  }

  return (
    <div className="user-profile">
      <img src={userData.photoURL} alt={`${userData.name}'s profile`} className="profile-photo" />
      <h2>{userData.name}</h2>
      <div className="skills">
        <div className="skills-offered">
          <h3>Skills Offered</h3>
          {userData.skillsOffered && userData.skillsOffered.length > 0 ? (
            <ul>
              {userData.skillsOffered.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          ) : (
            <p>No skills offered</p>
          )}
        </div>
        <div className="skills-wanted">
          <h3>Skills Wanted</h3>
          {userData.skillsWanted && userData.skillsWanted.length > 0 ? (
            <ul>
              {userData.skillsWanted.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          ) : (
            <p>No skills wanted</p>
          )}
        </div>
      </div>
      <div className="rating">
        <h3>Rating</h3>
        <p>{userData.rating ? `${userData.rating} / 5` : 'No rating yet'}</p>
      </div>
      <div className="feedback">
        <h3>Feedback</h3>
        {userData.feedback && userData.feedback.length > 0 ? (
          userData.feedback.map((fb, index) => (
            <div key={index} className="feedback-item">
              <p>{fb.text}</p>
              <p>- {fb.reviewer}</p>
            </div>
          ))
        ) : (
          <p>No feedback yet</p>
        )}
      </div>
      <button onClick={handleRequest}>Request</button>
      {showLoginModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Login Required</h2>
            <p>Please login or signup to send a request.</p>
            <button onClick={() => navigate(`/login?redirect=/request/${id}`)}>Login</button>
            <button onClick={() => navigate(`/signup?redirect=/request/${id}`)}>Signup</button>
            <button onClick={() => setShowLoginModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;