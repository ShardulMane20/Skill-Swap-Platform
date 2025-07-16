import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './UserPreviewModal.css';

const UserPreviewModal = ({ userId, onClose }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const ref = doc(db, 'users', userId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProfile(snap.data());
      }
    };
    fetchProfile();
  }, [userId]);

  if (!profile) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{profile.name}</h2>
        <img src={profile.photoURL} alt="profile" className="preview-photo" />
        <p><strong>Availability:</strong> {profile.availability}</p>

        <div className="skills-group">
          <h4>Skills Offered</h4>
          <ul>
            {profile.skillsOffered?.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </div>

        <div className="skills-group">
          <h4>Skills Wanted</h4>
          <ul>
            {profile.skillsWanted?.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserPreviewModal;
