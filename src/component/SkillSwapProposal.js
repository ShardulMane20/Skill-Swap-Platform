import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import './SkillSwapProposal.css';
import { FiArrowLeft, FiSend, FiChevronDown, FiUser, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const SkillSwapProposal = () => {
  const [user] = useAuthState(auth);
  const { id: targetUserId } = useParams();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState('');
  const [selectedWantedSkill, setSelectedWantedSkill] = useState('');
  const [message, setMessage] = useState('');
  const [showOfferedSkills, setShowOfferedSkills] = useState(false);
  const [showWantedSkills, setShowWantedSkills] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!user || !targetUserId) return;

        const userRef = doc(db, 'users', user.uid);
        const targetRef = doc(db, 'users', targetUserId);

        const [userSnap, targetSnap] = await Promise.all([
          getDoc(userRef),
          getDoc(targetRef)
        ]);

        if (userSnap.exists()) setCurrentUser(userSnap.data());
        if (targetSnap.exists()) setTargetUser(targetSnap.data());
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, targetUserId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOfferedSkill || !selectedWantedSkill || !message) return;

    try {
      setSubmitting(true);
      
      const proposalData = {
        from: {
          id: user.uid,
          name: currentUser?.name || 'Anonymous',
          photoURL: currentUser?.photoURL || '',
        },
        to: {
          id: targetUserId,
          name: targetUser?.name || 'Anonymous',
          photoURL: targetUser?.photoURL || '',
        },
        offeredSkill: selectedOfferedSkill,
        wantedSkill: selectedWantedSkill,
        message,
        status: 'pending',
        timestamp: new Date(),
      };

      await addDoc(collection(db, 'proposals'), proposalData);
      navigate('/success', { state: { message: 'Swap proposal submitted successfully!' } });
    } catch (error) {
      console.error("Error submitting proposal:", error);
      alert('Failed to submit proposal. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading user data...</p>
      </div>
    );
  }

  if (!currentUser || !targetUser) {
    return (
      <div className="error-container">
        <FiAlertTriangle className="error-icon" />
        <p>Failed to load user data</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="proposal-container">
      <header className="proposal-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiArrowLeft size={24} />
        </button>
        <h1>New Skill Swap Proposal</h1>
      </header>

      <div className="user-cards">
        <div className="user-card">
          <div className="user-avatar">
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt={currentUser.name} />
            ) : (
              <FiUser size={48} className="default-avatar" />
            )}
          </div>
          <h3>You</h3>
          <p className="user-skills-count">
            {currentUser.skillsOffered?.length || 0} skills offered
          </p>
        </div>

        <div className="exchange-icon">⇄</div>

        <div className="user-card">
          <div className="user-avatar">
            {targetUser.photoURL ? (
              <img src={targetUser.photoURL} alt={targetUser.name} />
            ) : (
              <FiUser size={48} className="default-avatar" />
            )}
          </div>
          <h3>{targetUser.name || 'User'}</h3>
          <p className="user-skills-count">
            {targetUser.skillsWanted?.length || 0} skills wanted
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="proposal-form">
        <div className="form-section">
          <label className="section-label">
            <span className="label-text">Your Offered Skill</span>
            <span className="required-indicator">*</span>
          </label>
          <div className={`dropdown-container ${showOfferedSkills ? 'active' : ''}`}>
            <div
              className="dropdown-header"
              onClick={() => setShowOfferedSkills(!showOfferedSkills)}
            >
              <span className={selectedOfferedSkill ? '' : 'placeholder'}>
                {selectedOfferedSkill || "Select a skill to offer"}
              </span>
              <FiChevronDown className={`dropdown-icon ${showOfferedSkills ? 'open' : ''}`} />
            </div>
            {showOfferedSkills && (
              <div className="dropdown-list">
                {currentUser.skillsOffered?.length > 0 ? (
                  currentUser.skillsOffered.map((skill, index) => (
                    <div
                      key={index}
                      className={`dropdown-item ${selectedOfferedSkill === skill ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedOfferedSkill(skill);
                        setShowOfferedSkills(false);
                      }}
                    >
                      {skill}
                      {selectedOfferedSkill === skill && <FiCheckCircle className="check-icon" />}
                    </div>
                  ))
                ) : (
                  <div className="dropdown-empty">No skills available</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <label className="section-label">
            <span className="label-text">Their Wanted Skill</span>
            <span className="required-indicator">*</span>
          </label>
          <div className={`dropdown-container ${showWantedSkills ? 'active' : ''}`}>
            <div
              className="dropdown-header"
              onClick={() => setShowWantedSkills(!showWantedSkills)}
            >
              <span className={selectedWantedSkill ? '' : 'placeholder'}>
                {selectedWantedSkill || "Select a skill they want"}
              </span>
              <FiChevronDown className={`dropdown-icon ${showWantedSkills ? 'open' : ''}`} />
            </div>
            {showWantedSkills && (
              <div className="dropdown-list">
                {targetUser.skillsWanted?.length > 0 ? (
                  targetUser.skillsWanted.map((skill, index) => (
                    <div
                      key={index}
                      className={`dropdown-item ${selectedWantedSkill === skill ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedWantedSkill(skill);
                        setShowWantedSkills(false);
                      }}
                    >
                      {skill}
                      {selectedWantedSkill === skill && <FiCheckCircle className="check-icon" />}
                    </div>
                  ))
                ) : (
                  <div className="dropdown-empty">No skills available</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <label className="section-label">
            <span className="label-text">Your Message</span>
            <span className="required-indicator">*</span>
          </label>
          <textarea
            className="message-input"
            placeholder="Explain why this would be a great swap (e.g., your experience, availability, etc.)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
          />
          <div className="character-count">{message.length}/500</div>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={!selectedOfferedSkill || !selectedWantedSkill || !message || submitting}
        >
          {submitting ? (
            <span className="button-loading">
              <span className="spinner"></span>
              Submitting...
            </span>
          ) : (
            <>
              <FiSend className="send-icon" />
              Submit Proposal
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SkillSwapProposal;