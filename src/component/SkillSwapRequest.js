// SkillSwapRequest.js
import React, { useState, useEffect } from 'react';
import { FiHome, FiSearch, FiUser, FiAlertTriangle, FiCheck, FiX } from 'react-icons/fi';
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
  limit
} from 'firebase/firestore';
import './SkillSwapRequest.css';

const swapRequestCollection = collection(db, 'swapRequests');

const SkillSwapRequest = () => {
  const [user] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState('pending');
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const perPage = 5;

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const q = query(
      swapRequestCollection,
      where('participants', 'array-contains', user.uid),
      orderBy('timestamp', 'desc'),
      limit(perPage * currentPage)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setRequests(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setIsLoading(false);
      },
      (err) => {
        setError('Failed to load requests. Please try again.');
        setIsLoading(false);
      }
    );
    return () => unsub();
  }, [user, currentPage]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'swapRequests', id), { status: newStatus });
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const filtered = requests.filter(r =>
    activeTab === 'all' ? true : r.status === activeTab
  );

  const pages = Array.from(
    { length: Math.ceil(filtered.length / perPage) },
    (_, i) => i + 1
  );

  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  if (!user) return <div>Please log in to view your requests.</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return (
    <div className="error-message">
      {error}
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  return (
    <div className="skill-swap-container">
      <header className="swap-header">
        <h1>Skill Swap Platform</h1>
        <div className="header-icons">
          <FiHome className="icon" />
          <FiSearch className="icon" />
          <FiUser className="icon" />
        </div>
      </header>

      <div className="warning-banner">
        <FiAlertTriangle className="warning-icon" />
        <span>You have {requests.filter(r => r.status === 'pending').length} pending requests</span>
      </div>

      <div className="status-tabs">
        {['pending', 'rejected', 'all'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}{tab === 'all' ? ' Requests' : ''}
          </button>
        ))}
      </div>

      <div className="requests-list">
        {paginated.map(r => (
          <div key={r.id} className={`request-card ${r.status}`}>
            <div className="user-info">
              <img
                src={r.to.id === user.uid ? r.from.photoURL : r.to.photoURL}
                alt=""
                className="profile-photo"
              />
              <div className="user-details">
                <h3>{r.to.id === user.uid ? r.from.name : r.to.name}</h3>
                <span className="request-date">
                  {new Date(r.timestamp).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="skills-section">
              <div className="skills-row">
                <span className="skills-label">Offered:</span>
                {r.offeredSkill}
              </div>
              <div className="skills-row">
                <span className="skills-label">Wanted:</span>
                {r.wantedSkill}
              </div>
            </div>

            {r.status === 'pending' && r.to.id === user.uid && (
              <div className="action-buttons">
                <button className="accept-btn" onClick={() => handleStatusChange(r.id, 'accepted')}>
                  <FiCheck /> Accept
                </button>
                <button className="reject-btn" onClick={() => handleStatusChange(r.id, 'rejected')}>
                  <FiX /> Reject
                </button>
              </div>
            )}

            {r.status !== 'pending' && (
              <div className={`status-badge ${r.status}`}>
                {r.status === 'accepted' ? <FiCheck /> : <FiX />}
                {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          className="page-btn"
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
        </button>
        {pages.map(p => (
          <button
            key={p}
            className={`page-btn ${currentPage === p ? 'active' : ''}`}
            onClick={() => setCurrentPage(p)}
          >
            {p}
          </button>
        ))}
        <button
          className="page-btn"
          disabled={currentPage >= pages.length}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
        </button>
      </div>
    </div>
  );
};

export default SkillSwapRequest;