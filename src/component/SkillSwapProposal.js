import React, { useState } from 'react';
import { FiArrowLeft, FiSend, FiChevronDown } from 'react-icons/fi';
import './SkillSwapProposal.css';

const SkillSwapProposal = () => {
  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState('');
  const [selectedWantedSkill, setSelectedWantedSkill] = useState('');
  const [message, setMessage] = useState('');
  const [showOfferedSkills, setShowOfferedSkills] = useState(false);
  const [showWantedSkills, setShowWantedSkills] = useState(false);

  // Sample data - replace with your actual data
  const userSkills = [
    { id: 1, name: "Graphic Design" },
    { id: 2, name: "Web Development" },
    { id: 3, name: "Photo Editing" },
    { id: 4, name: "Content Writing" },
  ];

  const partnerSkills = [
    { id: 1, name: "Video Editing" },
    { id: 2, name: "SEO Optimization" },
    { id: 3, name: "Social Media Management" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      offeredSkill: selectedOfferedSkill,
      wantedSkill: selectedWantedSkill,
      message
    });
    alert('Swap proposal submitted successfully!');
  };

  return (
    <div className="swap-proposal-container">
      {/* Header */}
      <header className="proposal-header">
        <button className="back-button">
          <FiArrowLeft size={20} />
        </button>
        <h1>Create Swap Proposal</h1>
      </header>

      {/* Main Content */}
      <div className="proposal-content">
        <form onSubmit={handleSubmit}>
          {/* Offered Skills Section */}
          <div className="form-section">
            <h2 className="section-title">
              Choose one of your offered skills ({userSkills.length} available)
            </h2>
            <div className="dropdown-container">
              <div 
                className="dropdown-header"
                onClick={() => setShowOfferedSkills(!showOfferedSkills)}
              >
                <span>
                  {selectedOfferedSkill || "Select a skill"}
                </span>
                <FiChevronDown className={`dropdown-icon ${showOfferedSkills ? 'open' : ''}`} />
              </div>
              {showOfferedSkills && (
                <div className="dropdown-list">
                  {userSkills.map(skill => (
                    <div 
                      key={skill.id}
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedOfferedSkill(skill.name);
                        setShowOfferedSkills(false);
                      }}
                    >
                      {skill.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Wanted Skills Section */}
          <div className="form-section">
            <h2 className="section-title">
              Choose one of their wanted skills ({partnerSkills.length} available)
            </h2>
            <div className="dropdown-container">
              <div 
                className="dropdown-header"
                onClick={() => setShowWantedSkills(!showWantedSkills)}
              >
                <span>
                  {selectedWantedSkill || "Select a skill"}
                </span>
                <FiChevronDown className={`dropdown-icon ${showWantedSkills ? 'open' : ''}`} />
              </div>
              {showWantedSkills && (
                <div className="dropdown-list">
                  {partnerSkills.map(skill => (
                    <div 
                      key={skill.id}
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedWantedSkill(skill.name);
                        setShowWantedSkills(false);
                      }}
                    >
                      {skill.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message Section */}
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

          {/* Submit Button */}
          <button 
            type="submit" 
            className="submit-button"
            disabled={!selectedOfferedSkill || !selectedWantedSkill}
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