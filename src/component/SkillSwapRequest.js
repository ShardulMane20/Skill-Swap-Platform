import React, { useState, useEffect } from 'react';
import { 
   
  FiSearch, 
  FiUser, 
  FiAlertTriangle, 
  FiCheck, 
  FiX, 
  FiChevronLeft, 
  FiChevronRight,
  FiMail,
  FiClock,
  FiSettings,
  FiPlusCircle
} from 'react-icons/fi';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  orderBy,
  getDoc
} from 'firebase/firestore';
import './SkillSwapRequest.css';

const SkillSwapRequest = () => {
  const [user] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState('pending');
  const [requests, setRequests] = useState([]);
  const [profile, setProfile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const perPage = 5;

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch user profile
        const profileDoc = await getDoc(doc(db, 'users', user.uid));
        if (profileDoc.exists()) {
          setProfile({ id: profileDoc.id, ...profileDoc.data() });
        }

        // Set up real-time request listener
        const q = query(
          collection(db, 'swapRequests'),
          where('participants', 'array-contains', user.uid),
          orderBy('timestamp', 'desc')
        );
        
        const unsub = onSnapshot(q, (snap) => {
          setRequests(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setIsLoading(false);
        });

        return unsub;
      } catch (err) {
        setError('Failed to load data. Please try again.');
        setIsLoading(false);
        console.error('Error loading data:', err);
      }
    };

    fetchData();
  }, [user]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setIsLoading(true);
      await updateDoc(doc(db, 'swapRequests', id), { status: newStatus });
    } catch (err) {
      setError('Failed to update request status. Please try again.');
      console.error('Status update failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = requests.filter(r =>
    activeTab === 'all' ? true : r.status === activeTab
  );

  const totalPages = Math.ceil(filteredRequests.length / perPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  if (!user) return (
    <div className="auth-message">
      <h2>Please log in to view your profile and requests</h2>
      <button className="primary-btn" onClick={() => window.location.href = '/login'}>
        Go to Login
      </button>
    </div>
  );

  if (isLoading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading your profile...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <FiAlertTriangle className="error-icon" />
      <p>{error}</p>
      <button className="retry-btn" onClick={() => window.location.reload()}>
        Retry
      </button>
    </div>
  );

  return (
    <div className="profile-request-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">SkillSwap</h1>
          <div className="header-actions">
            <button className="icon-btn">
              <FiSearch size={20} />
            </button>
            <button className="icon-btn">
              <FiMail size={20} />
            </button>
            <button className="icon-btn">
              <FiSettings size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Profile Section */}
      <section className="profile-section">
        <div className="profile-header">
          <div className="profile-avatar">
            <img 
              src={profile?.photoURL || '/default-avatar.png'} 
              alt="Profile" 
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
            <button className="edit-profile-btn">
              <FiPlusCircle size={16} />
            </button>
          </div>
          <div className="profile-info">
            <h2>{profile?.name || 'Your Name'}</h2>
            <p className="profile-bio">{profile?.bio || 'Add a bio to tell others about yourself'}</p>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{requests.length}</span>
                <span className="stat-label">Requests</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {requests.filter(r => r.status === 'accepted').length}
                </span>
                <span className="stat-label">Connections</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{profile?.rating || '0'}</span>
                <span className="stat-label">Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="skills-display">
          <div className="skills-column">
            <h3><FiCheck className="icon" /> Skills I Offer</h3>
            <div className="skills-tags">
              {profile?.skillsOffered?.length > 0 ? (
                profile.skillsOffered.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))
              ) : (
                <p className="no-skills">No skills added yet</p>
              )}
            </div>
          </div>
          <div className="skills-column">
            <h3><FiClock className="icon" /> Skills I Want</h3>
            <div className="skills-tags">
              {profile?.skillsWanted?.length > 0 ? (
                profile.skillsWanted.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))
              ) : (
                <p className="no-skills">No skills wanted yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="availability-section">
          <h3><FiClock className="icon" /> Availability</h3>
          <p>{profile?.availability || 'Not specified'}</p>
        </div>
      </section>

      {/* Requests Section */}
      <section className="requests-section">
        <div className="section-header">
          <h2>My Requests</h2>
          {pendingCount > 0 && (
            <div className="pending-badge">
              <FiAlertTriangle className="warning-icon" />
              <span>{pendingCount} pending</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="request-tabs">
          {['pending', 'accepted', 'rejected', 'all'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div className="requests-list">
          {paginatedRequests.length > 0 ? (
            paginatedRequests.map(request => (
              <div key={request.id} className={`request-card ${request.status}`}>
                <div className="request-user">
                  <img
                    src={request.to.id === user.uid ? 
                      request.from?.photoURL || '/default-avatar.png' : 
                      request.to?.photoURL || '/default-avatar.png'
                    }
                    alt="User"
                    className="user-avatar"
                  />
                  <div className="user-details">
                    <h3>
                      {request.to.id === user.uid ? 
                        request.from?.name || 'Unknown' : 
                        request.to?.name || 'Unknown'
                      }
                    </h3>
                    <p className="request-date">
                      {new Date(request.timestamp?.toDate?.() || request.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="request-details">
                  <div className="skill-exchange">
                    <div className="skill-item">
                      <span className="skill-label">Offers:</span>
                      <span className="skill-name">{request.offeredSkill || 'Not specified'}</span>
                    </div>
                    <div className="exchange-arrow">⇄</div>
                    <div className="skill-item">
                      <span className="skill-label">Wants:</span>
                      <span className="skill-name">{request.wantedSkill || 'Not specified'}</span>
                    </div>
                  </div>

                  {request.status === 'pending' && request.to.id === user.uid && (
                    <div className="request-actions">
                      <button 
                        className="accept-btn"
                        onClick={() => handleStatusChange(request.id, 'accepted')}
                        disabled={isLoading}
                      >
                        <FiCheck /> Accept
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => handleStatusChange(request.id, 'rejected')}
                        disabled={isLoading}
                      >
                        <FiX /> Decline
                      </button>
                    </div>
                  )}

                  {request.status !== 'pending' && (
                    <div className={`status-indicator ${request.status}`}>
                      {request.status === 'accepted' ? (
                        <FiCheck className="status-icon" />
                      ) : (
                        <FiX className="status-icon" />
                      )}
                      <span>{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-requests">
              <FiUser className="empty-icon" />
              <p>No {activeTab === 'all' ? '' : activeTab} requests found</p>
              <button className="explore-btn" onClick={() => window.location.href = '/home'}>
                Explore Skills
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              <FiChevronLeft /> Previous
            </button>
            
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              className="pagination-btn"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next <FiChevronRight />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default SkillSwapRequest;