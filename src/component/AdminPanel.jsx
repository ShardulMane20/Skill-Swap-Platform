import React, { useState, useEffect } from 'react';
import { FiUsers, FiAlertTriangle, FiMessageSquare, FiDownload, FiEye, FiX, FiCheck, FiSend } from 'react-icons/fi';
import './AdminPanel.css';

const AdminPanel = () => {
  // State for different admin sections
  const [activeTab, setActiveTab] = useState('pendingSwaps');
  const [users, setUsers] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [reports, setReports] = useState([]);
  const [adminMessage, setAdminMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with API calls in a real implementation
  useEffect(() => {
    // Simulate loading users
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', skills: ['Web Development', 'Graphic Design'], status: 'active', violations: 0 },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', skills: ['Photo Editing', 'Content Writing'], status: 'active', violations: 2 },
      { id: 3, name: 'Spam User', email: 'spam@example.com', skills: ['Fake Skill'], status: 'active', violations: 5 },
    ];

    // Simulate loading swaps
    const mockSwaps = [
      { id: 1, user1: 'John Doe', user2: 'Jane Smith', skill1: 'Web Development', skill2: 'Photo Editing', status: 'completed', date: '2023-05-15' },
      { id: 2, user1: 'Jane Smith', user2: 'Spam User', skill1: 'Content Writing', skill2: 'Fake Skill', status: 'pending', date: '2023-05-16' },
      { id: 3, user1: 'John Doe', user2: 'Spam User', skill1: 'Graphic Design', skill2: 'Fake Skill', status: 'rejected', date: '2023-05-17' },
    ];

    // Simulate loading reports
    const mockReports = [
      { id: 1, type: 'user_activity', period: 'Last 30 days', downloadLink: '#' },
      { id: 2, type: 'swap_stats', period: 'Last 30 days', downloadLink: '#' },
      { id: 3, type: 'feedback_logs', period: 'Last 30 days', downloadLink: '#' },
    ];

    setUsers(mockUsers);
    setSwaps(mockSwaps);
    setReports(mockReports);
  }, []);

  // Admin functions
  const rejectSkill = (swapId) => {
    setSwaps(swaps.map(swap => 
      swap.id === swapId ? { ...swap, status: 'rejected' } : swap
    ));
  };

  const approveSkill = (swapId) => {
    setSwaps(swaps.map(swap => 
      swap.id === swapId ? { ...swap, status: 'approved' } : swap
    ));
  };

  const banUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'banned' } : user
    ));
  };

  const sendPlatformMessage = () => {
    alert(`Platform message sent: "${adminMessage}"`);
    setAdminMessage('');
  };

  const downloadReport = (reportId) => {
    alert(`Downloading report ${reportId}`);
    // In a real app, this would trigger a file download
  };

  // Filter data based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSwaps = swaps.filter(swap => 
    swap.user1.toLowerCase().includes(searchTerm.toLowerCase()) ||
    swap.user2.toLowerCase().includes(searchTerm.toLowerCase()) ||
    swap.skill1.toLowerCase().includes(searchTerm.toLowerCase()) ||
    swap.skill2.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Skill Swap Admin Panel</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search users or swaps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <nav className="admin-nav">
        <button 
          className={activeTab === 'pendingSwaps' ? 'active' : ''}
          onClick={() => setActiveTab('pendingSwaps')}
        >
          <FiEye /> Pending Swaps
        </button>
        <button 
          className={activeTab === 'userManagement' ? 'active' : ''}
          onClick={() => setActiveTab('userManagement')}
        >
          <FiUsers /> User Management
        </button>
        <button 
          className={activeTab === 'violations' ? 'active' : ''}
          onClick={() => setActiveTab('violations')}
        >
          <FiAlertTriangle /> Violations
        </button>
        <button 
          className={activeTab === 'platformMessages' ? 'active' : ''}
          onClick={() => setActiveTab('platformMessages')}
        >
          <FiMessageSquare /> Platform Messages
        </button>
        <button 
          className={activeTab === 'reports' ? 'active' : ''}
          onClick={() => setActiveTab('reports')}
        >
          <FiDownload /> Reports
        </button>
      </nav>

      <main className="admin-main">
        {/* Pending Swaps Section */}
        {activeTab === 'pendingSwaps' && (
          <section>
            <h2>Pending Skill Swaps</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User 1</th>
                    <th>User 2</th>
                    <th>Skill Offered</th>
                    <th>Skill Wanted</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSwaps
                    .filter(swap => swap.status === 'pending')
                    .map(swap => (
                      <tr key={swap.id}>
                        <td>{swap.id}</td>
                        <td>{swap.user1}</td>
                        <td>{swap.user2}</td>
                        <td>{swap.skill1}</td>
                        <td>{swap.skill2}</td>
                        <td>{swap.date}</td>
                        <td>
                          <button className="approve-btn" onClick={() => approveSkill(swap.id)}>
                            <FiCheck /> Approve
                          </button>
                          <button className="reject-btn" onClick={() => rejectSkill(swap.id)}>
                            <FiX /> Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* User Management Section */}
        {activeTab === 'userManagement' && (
          <section>
            <h2>User Management</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Skills</th>
                    <th>Status</th>
                    <th>Violations</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.skills.join(', ')}</td>
                      <td className={`status ${user.status}`}>{user.status}</td>
                      <td>{user.violations}</td>
                      <td>
                        {user.status === 'active' ? (
                          <button className="ban-btn" onClick={() => banUser(user.id)}>
                            <FiX /> Ban
                          </button>
                        ) : (
                          <span className="banned-text">Banned</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Violations Section */}
        {activeTab === 'violations' && (
          <section>
            <h2>Recent Violations</h2>
            <div className="violations-list">
              {users
                .filter(user => user.violations > 0)
                .sort((a, b) => b.violations - a.violations)
                .map(user => (
                  <div key={user.id} className="violation-card">
                    <h3>{user.name} ({user.email})</h3>
                    <p>Violations: {user.violations}</p>
                    <p>Skills: {user.skills.join(', ')}</p>
                    <div className="violation-actions">
                      <button className="ban-btn" onClick={() => banUser(user.id)}>
                        <FiX /> Ban User
                      </button>
                      <button className="warn-btn">
                        <FiAlertTriangle /> Send Warning
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Platform Messages Section */}
        {activeTab === 'platformMessages' && (
          <section>
            <h2>Send Platform Message</h2>
            <div className="message-form">
              <textarea
                value={adminMessage}
                onChange={(e) => setAdminMessage(e.target.value)}
                placeholder="Enter your platform-wide message here..."
                rows={5}
              />
              <button className="send-btn" onClick={sendPlatformMessage}>
                <FiSend /> Send to All Users
              </button>
            </div>
          </section>
        )}

        {/* Reports Section */}
        {activeTab === 'reports' && (
          <section>
            <h2>Available Reports</h2>
            <div className="reports-grid">
              {reports.map(report => (
                <div key={report.id} className="report-card">
                  <h3>{report.type.replace('_', ' ').toUpperCase()}</h3>
                  <p>Period: {report.period}</p>
                  <button 
                    className="download-btn"
                    onClick={() => downloadReport(report.id)}
                  >
                    <FiDownload /> Download
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;