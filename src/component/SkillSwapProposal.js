import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSend, FiChevronDown } from 'react-icons/fi';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import './SkillSwapProposal.css';

const SkillSwapProposal = () => {
  const [user] = useAuthState(auth);
  const { id: targetUserId } = useParams(); // ID of the requested user
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [targetUser, setTargetUser] = useState(null);

  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState('');
  const [selectedWantedSkill, setSelectedWantedSkill] = useState('');
  const [message, setMessage] = useState('');
  const [showOfferedSkills, setShowOfferedSkills] = useState(false);
  const [showWantedSkills, setShowWantedSkills] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user || !targetUserId) return;

      const userRef = doc(db, 'users', user.uid);
      const targetRef = doc(db, 'users', targetUserId);

      const userSnap = await getDoc(userRef);
      const targetSnap = await getDoc(targetRef);

      if (userSnap.exists()) setCurrentUser(userSnap.data());
      if (targetSnap.exists()) setTargetUser(targetSnap.data());
    };

    fetchUsers();
  }, [user, targetUserId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedOfferedSkill || !selectedWantedSkill || !message) return;

    const proposalData = {
      from: {
        id: user.uid,
        name: currentUser?.name,
        photoURL: currentUser?.photoURL || '',
      },
      to: {
        id: targetUserId,
        name: targetUser?.name,
        photoURL: targetUser?.photoURL || '',
      },
      offeredSkill: selectedOfferedSkill,
      wantedSkill: selectedWantedSkill,
      message,
      timestamp: Date.now(),
    };

    await addDoc(collection(db, 'proposals'), proposalData);
    alert('Swap proposal submitted successfully!');
    navigate('/home');
  };

  if (!currentUser || !targetUser) {
    return <div className="loading">Loading user data...</div>;
  }

  return (
    <div className="swap-proposal-container">
      <header className="proposal-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiArrowLeft size={20} />
        </button>
        <h1>Create Swap Proposal</h1>
      </header>

      <div className="proposal-content">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h2 className="section-title">
              Choose one of your offered skills ({currentUser.skillsOffered?.length || 0} available)
            </h2>
            <div className="dropdown-container">
              <div
                className="dropdown-header"
                onClick={() => setShowOfferedSkills(!showOfferedSkills)}
              >
                <span>{selectedOfferedSkill || "Select a skill"}</span>
                <FiChevronDown className={`dropdown-icon ${showOfferedSkills ? 'open' : ''}`} />
              </div>
              {showOfferedSkills && (
                <div className="dropdown-list">
                  {currentUser.skillsOffered?.map((skill, index) => (
                    <div
                      key={index}
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedOfferedSkill(skill);
                        setShowOfferedSkills(false);
                      }}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">
              Choose one of their wanted skills ({targetUser.skillsWanted?.length || 0} available)
            </h2>
            <div className="dropdown-container">
              <div
                className="dropdown-header"
                onClick={() => setShowWantedSkills(!showWantedSkills)}
              >
                <span>{selectedWantedSkill || "Select a skill"}</span>
                <FiChevronDown className={`dropdown-icon ${showWantedSkills ? 'open' : ''}`} />
              </div>
              {showWantedSkills && (
                <div className="dropdown-list">
                  {targetUser.skillsWanted?.map((skill, index) => (
                    <div
                      key={index}
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedWantedSkill(skill);
                        setShowWantedSkills(false);
                      }}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Message</h2>
            <textarea
              className="message-input"
              placeholder="Write a message to explain your swap proposal..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={!selectedOfferedSkill || !selectedWantedSkill || !message}
          >
            <FiSend className="send-icon" />
            Submit Proposal
          </button>
        </form>
      </div>
    </div>
  );
};

export default SkillSwapProposal;
