import React, { useState } from 'react';
import { FiHome, FiSearch, FiUser, FiAlertTriangle, FiCheck, FiX } from 'react-icons/fi';
import './SkillSwapRequest.css';

const SkillSwapRequest = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [currentPage, setCurrentPage] = useState(1);

  const swapRequests = [
    {
      id: 1,
      name: "More Demo",
      photo: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 3.9,
      skillsOffered: ["Slow Script"],
      skillsWanted: ["Printed"],
      status: "pending",
      date: "2 hours ago"
    },
    {
      id: 2,
      name: "Alex Johnson",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.2,
      skillsOffered: ["Graphic Design", "Photo Editing"],
      skillsWanted: ["Web Development"],
      status: "rejected",
      date: "1 day ago"
    },
    // Add more requests as needed
  ];

  const filteredRequests = swapRequests.filter(request => 
    activeTab === 'all' || request.status === activeTab
  );

  return (
    <div className="skill-swap-container">
      {/* Header */}
      <header className="swap-header">
        <h1>Skill Swap Platform</h1>
        <div className="header-icons">
          <FiHome className="icon" />
          <FiSearch className="icon" />
          <FiUser className="icon" />
        </div>
      </header>

      {/* Warning Banner */}
      <div className="warning-banner">
        <FiAlertTriangle className="warning-icon" />
        <span>You have {swapRequests.filter(r => r.status === 'pending').length} pending requests</span>
      </div>

      {/* Status Tabs */}
      <div className="status-tabs">
        <button 
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </button>
        <button 
          className={`tab-btn ${activeTab === 'rejected' ? 'active' : ''}`}
          onClick={() => setActiveTab('rejected')}
        >
          Rejected
        </button>
        <button 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Requests
        </button>
      </div>

      {/* Swap Requests List */}
      <div className="requests-list">
        {filteredRequests.map(request => (
          <div key={request.id} className={`request-card ${request.status}`}>
            <div className="user-info">
              <img src={request.photo} alt={request.name} className="profile-photo" />
              <div className="user-details">
                <h3>{request.name}</h3>
                <div className="rating">
                  <span className="stars">★★★★☆</span>
                  <span className="rating-value">{request.rating}/5</span>
                </div>
                <span className="request-date">{request.date}</span>
              </div>
            </div>

            <div className="skills-section">
              <div className="skills-row">
                <span className="skills-label">Skills offered:</span>
                <div className="skills-tags">
                  {request.skillsOffered.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="skills-row">
                <span className="skills-label">Skills wanted:</span>
                <div className="skills-tags">
                  {request.skillsWanted.map((skill, index) => (
                    <span key={index} className="skill-tag wanted">{skill}</span>
                  ))}
                </div>
              </div>
            </div>

            {request.status === 'pending' && (
              <div className="action-buttons">
                <button className="accept-btn">
                  <FiCheck /> Accept
                </button>
                <button className="reject-btn">
                  <FiX /> Reject
                </button>
              </div>
            )}

            {request.status === 'rejected' && (
              <div className="status-badge rejected">
                <FiX /> Rejected
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button 
          className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        >
          &lt;
        </button>
        {[1, 2, 3].map(page => (
          <button 
            key={page}
            className={`page-btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        <button 
          className={`page-btn ${currentPage === 3 ? 'disabled' : ''}`}
          disabled={currentPage === 3}
          onClick={() => setCurrentPage(prev => Math.min(3, prev + 1))}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default SkillSwapRequest;