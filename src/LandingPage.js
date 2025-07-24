import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.jpg';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const scrollAmount = useRef(0);
  const isHovered = useRef(false);
  const animationFrameId = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // Clone first few items for seamless looping
    const items = carousel.querySelectorAll('.feature-card');
    const cloneCount = Math.min(3, items.length);
    
    Array.from(items).slice(0, cloneCount).forEach(item => {
      carousel.appendChild(item.cloneNode(true));
    });

    // Auto-scroll logic
    const autoScroll = () => {
      if (!isHovered.current && carousel.scrollWidth > carousel.clientWidth) {
        scrollAmount.current += 0.5; // Slower scroll speed
        
        // Reset to start when reaching end (with threshold)
        if (scrollAmount.current >= carousel.scrollWidth / 2) {
          scrollAmount.current = 0;
          carousel.scrollTo({ left: 0, behavior: 'instant' });
        } else {
          carousel.scrollTo({ left: scrollAmount.current, behavior: 'smooth' });
        }
      }
      animationFrameId.current = requestAnimationFrame(autoScroll);
    };

    // Event listeners
    const handleMouseEnter = () => {
      isHovered.current = true;
    };
    
    const handleMouseLeave = () => {
      isHovered.current = false;
    };

    const handleTouchStart = (e) => {
      isHovered.current = true;
    };
    
    const handleTouchEnd = () => {
      setTimeout(() => {
        isHovered.current = false;
      }, 1000);
    };

    carousel.addEventListener('mouseenter', handleMouseEnter);
    carousel.addEventListener('mouseleave', handleMouseLeave);
    carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
    carousel.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Start animation
    autoScroll();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId.current);
      carousel.removeEventListener('mouseenter', handleMouseEnter);
      carousel.removeEventListener('mouseleave', handleMouseLeave);
      carousel.removeEventListener('touchstart', handleTouchStart);
      carousel.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const features = [
    {
      icon: '🎓',
      title: 'Learn Anything',
      description: 'From coding to cooking, 1000+ peer-taught courses'
    },
    {
      icon: '👨‍🏫',
      title: 'Teach & Earn',
      description: 'Monetize your expertise effortlessly'
    },
    {
      icon: '🌐',
      title: 'Global Network',
      description: 'Connect with learners worldwide'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Visual dashboards for all skills'
    },
    {
      icon: '💬',
      title: 'Live Sessions',
      description: 'Real-time Q&A with experts'
    },
    {
      icon: '🏆',
      title: 'Certification',
      description: 'Earn verifiable credentials'
    }
  ];

  return (
    <div className="landing-container">
      {/* Animated background elements */}
      <div className="bg-mesh"></div>
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>

      {/* Main content */}
      <div className="landing-content">
        <div className="logo">
          <img src={logo} alt="SkillSync Logo" />
        </div>

        <h1 className="landing-title">
          SkillSwp
        </h1>

        <p className="landing-subtitle">
          The future of peer-to-peer learning. Master new skills by connecting with experts 
          in your community, or monetize your knowledge by teaching others. 
          Join 50,000+ learners today.
        </p>

        <button
          className="cta-button"
          onClick={() => navigate('/home')}
        >
          🚀 Get Started — It's Free
        </button>
      </div>

      {/* Feature carousel */}
      <div className="features-carousel-container">
        <div 
          className="features-carousel"
          ref={carouselRef}
        >
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;