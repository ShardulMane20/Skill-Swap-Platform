// HomePage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  startAfter,
  getCountFromServer,
} from "firebase/firestore";
import "./HomePage.css";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageDocs, setPageDocs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isNavigating, setIsNavigating] = useState(false);
  const profilesPerPage = 3;
  const [availability, setAvailability] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        let profilesQuery = query(
          collection(db, "users"),
          where("isPublic", "==", true)
        );
        if (availability) {
          profilesQuery = query(profilesQuery, where("availability", "==", availability));
        }
        if (currentPage > 1 && pageDocs[currentPage - 2]) {
          profilesQuery = query(profilesQuery, startAfter(pageDocs[currentPage - 2]));
        }
        profilesQuery = query(profilesQuery, limit(profilesPerPage));

        const querySnapshot = await getDocs(profilesQuery);
        const profilesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filteredProfiles = profilesData.filter((profile) => {
          const q = searchQuery.toLowerCase();
          return (
            (profile.name?.toLowerCase() || "").includes(q) ||
            (profile.skillsOffered || []).some((skill) => skill.toLowerCase().includes(q)) ||
            (profile.skillsWanted || []).some((skill) => skill.toLowerCase().includes(q))
          );
        });

        setProfiles(filteredProfiles);
        const newPageDocs = [...pageDocs];
        newPageDocs[currentPage - 1] = querySnapshot.docs[querySnapshot.docs.length - 1];
        setPageDocs(newPageDocs);

        const totalSnapshot = await getCountFromServer(
          query(collection(db, "users"), where("isPublic", "==", true))
        );
        setTotalPages(Math.ceil(totalSnapshot.data().count / profilesPerPage));
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    const debounceFetch = setTimeout(() => {
      fetchProfiles();
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [currentPage, availability, searchQuery]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRequest = (profileId) => {
    if (!user) {
      setShowLoginPopup(true);
    } else {
      navigate(`/proposal/${profileId}`);
    }
  };

  const handleRequestNavigation = () => {
    setIsNavigating(true);
    navigate('/request');
  };

  const handleLoginPopupClose = () => {
    setShowLoginPopup(false);
  };

  const handleLoginRedirect = () => {
    setShowLoginPopup(false);
    navigate('/profile-setup');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="home-container">
      <nav className="main-nav">
        <div className="nav-container">
          <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <i className="fas fa-exchange-alt"></i>
            <span>SkillSwap</span>
          </div>
          <div className="nav-actions">
            {user ? (
              <div className="user-menu">
                <button
                  className="user-btn"
                  onClick={handleRequestNavigation}
                  disabled={isNavigating}
                  aria-label="View my skill swap requests"
                >
                  <i className="fas fa-user-circle"></i>
                  <span>{isNavigating ? 'Loading...' : 'My Requests'}</span>
                </button>
              </div>
            ) : (
              <button className="nav-btn primary" onClick={() => navigate('/profile-setup')}>
                Sign In
              </button>
            )}
            <button className="mobile-menu-btn" onClick={toggleMenu}>
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <h1>Connect, Collaborate, Grow</h1>
          <p>Find the perfect skill exchange partner and expand your knowledge</p>
        </div>
      </section>

      <main className="main-content">
        <div className="search-container">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search skills, interests, or names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="availability-dropdown"
          >
            <option value="">All Availability</option>
            <option value="Weekends">Weekends</option>
            <option value="Evenings">Evenings</option>
          </select>
        </div>

        <div className="profiles-grid">
          {profiles.length > 0 ? (
            profiles.map((profile) => (
              <div key={profile.id} className="profile-card">
                <div className="card-header">
                  <div className="profile-photo">
                    {profile.photoURL ? (
                      <img src={profile.photoURL} alt={`${profile.name}'s profile`} />
                    ) : (
                      <div className="placeholder-photo">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                  </div>
                  <div className="profile-info">
                    <h2>{profile.name}</h2>
                    <div className="rating">
                      <i className="fas fa-star"></i>
                      <span>{profile.rating || "New"}</span>
                    </div>
                  </div>
                </div>
                <div className="skills-section">
                  <div className="skills-group">
                    <h3><i className="fas fa-arrow-up"></i> Offers</h3>
                    <div className="skills-tags">
                      {profile.skillsOffered?.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="skills-group">
                    <h3><i className="fas fa-arrow-down"></i> Wants</h3>
                    <div className="skills-tags">
                      {profile.skillsWanted?.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <button
                    className="request-btn"
                    onClick={() => handleRequest(profile.id)}
                    aria-label={`Connect with ${profile.name}`}
                  >
                    <i className="fas fa-handshake"></i> Connect
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-profiles">
              <i className="fas fa-users"></i>
              <p>No public profiles available matching your criteria</p>
            </div>
          )}
        </div>

        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="pagination-btn"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-btn ${currentPage === page ? "active" : ""}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="pagination-btn"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </main>

      {showLoginPopup && (
        <div className="login-popup">
          <div className="popup-content">
            <h2>Join the Community</h2>
            <p>Sign in to connect with other members and start skill swapping!</p>
            <div className="popup-buttons">
              <button className="popup-login-btn" onClick={handleLoginRedirect}>
                <i className="fas fa-sign-in-alt"></i> Sign In
              </button>
              <button className="popup-close-btn" onClick={handleLoginPopupClose}>
                <i className="fas fa-times"></i> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;