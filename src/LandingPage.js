import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.jpg';
import './LandingPage.css'; // Link to external CSS

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="circle top-right"></div>
      <div className="circle bottom-left"></div>

      <div className="landing-content">
        <div className="logo animated-logo">
          <img src={logo} alt="SkillSync Logo" />
        </div>

        <h1 className="landing-title">
          Skill<span className="highlight">Sync</span>
        </h1>

        <p className="landing-subtitle">
          Learn from peers. Teach what you know. Grow together in our vibrant community of skill-sharing enthusiasts.
        </p>

        <button
          className="cta-button"
          onClick={() => navigate('/home')}
        >
          🚀 Get Started
        </button>

        <div className="features-grid">
          <div className="feature-box">
            <div className="feature-icon">🎓</div>
            <h3>Learn</h3>
            <p>Acquire new skills from peers</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon">👨‍🏫</div>
            <h3>Teach</h3>
            <p>Share your knowledge with others</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon">🤝</div>
            <h3>Connect</h3>
            <p>Build your learning network</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
