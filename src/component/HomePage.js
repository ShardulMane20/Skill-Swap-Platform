import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
<<<<<<< HEAD
import GoogleLoginModal from "./GoogleLoginModel";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  startAfter
} from "firebase/firestore";

=======
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, limit, startAfter } from "firebase/firestore";
>>>>>>> d78287fd4f52d1dfa7d98f8f093fdb8226cbf2a2
import "./HomePage.css";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastDoc, setLastDoc] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
<<<<<<< HEAD
  const [availability, setAvailability] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const profilesPerPage = 3;
=======
  const profilesPerPage = 3;
  const [availability, setAvailability] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
>>>>>>> d78287fd4f52d1dfa7d98f8f093fdb8226cbf2a2
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
          where("isPublic", "==", true),
          limit(profilesPerPage)
        );
        if (availability) {
          profilesQuery = query(profilesQuery, where("availability", "==", availability));
        }
        if (lastDoc && currentPage > 1) {
          profilesQuery = query(profilesQuery, startAfter(lastDoc));
        }
<<<<<<< HEAD

=======
>>>>>>> d78287fd4f52d1dfa7d98f8f093fdb8226cbf2a2
        const querySnapshot = await getDocs(profilesQuery);
        const profilesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProfiles(profilesData);
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
<<<<<<< HEAD

=======
>>>>>>> d78287fd4f52d1dfa7d98f8f093fdb8226cbf2a2
        const totalProfilesSnapshot = await getDocs(
          query(collection(db, "users"), where("isPublic", "==", true))
        );
        setTotalPages(Math.ceil(totalProfilesSnapshot.size / profilesPerPage));
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };
    fetchProfiles();
  }, [currentPage, availability]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRequest = (profileId) => {
    if (!user) {
      setShowLoginPopup(true);
    } else {
      console.log(`Request sent to profile: ${profileId}`);
    }
  };

<<<<<<< HEAD
=======
  const handleLoginPopupClose = () => {
    setShowLoginPopup(false);
  };

  const handleLoginRedirect = () => {
    navigate("/login");
    setShowLoginPopup(false);
  };

>>>>>>> d78287fd4f52d1dfa7d98f8f093fdb8226cbf2a2
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
<<<<<<< HEAD
    <div className={`home-container ${showLoginPopup ? 'blurred' : ''}`}>
      {/* Navbar */}
=======
    <div className="home-container">
      {/* Enhanced Navbar */}
>>>>>>> d78287fd4f52d1dfa7d98f8f093fdb8226cbf2a2
      <nav className="main-nav">
        <div className="nav-container">
          <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <i className="fas fa-exchange-alt"></i>
            <span>SkillSwap</span>
          </div>
<<<<<<< HEAD
=======
          
          
          
>>>>>>> d78287fd4f52d1dfa7d98f8f093fdb8226cbf2a2
          <div className="nav-actions">
            {user ? (
              <div className="user-menu">
                <button className="user-btn" onClick={() => navigate("/profile")}>
                  <i className="fas fa-user-circle"></i>
                  <span>My Profile</span>
                </button>
              </div>
            ) : (
<<<<<<< HEAD
              <button className="nav-btn primary" onClick={() => setShowLoginPopup(true)}>
                Sign In
              </button>
=======
              <>
                
                <button className="nav-btn primary" onClick={() => navigate("/profile-setup")}>
                  Sign In
                </button>
              </>
>>>>>>> d78287fd4f52d1dfa7d98f8f093fdb8226cbf2a2
            )}
            <button className="mobile-menu-btn" onClick={toggleMenu}>
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
      </nav>

<<<<<<< HEAD
      {/* Hero */}
=======
      {/* Hero Section */}
>>>>>>> d78287fd4f52d1dfa7d98f8f093fdb8226cbf2a2
      <section className="hero-section">
        <div className="hero-content">
          <h1>Connect, Collaborate, Grow</h1>
          <p>Find the perfect skill exchange partner and expand your knowledge</p>
        </div>
      </section>

<<<<<<< HEAD
      {/* Search */}
=======
      {/* Main Content */}
>>>>>>> d78287fd4f52d1dfa7d98f8f093fdb8226cbf2a2
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

<<<<<<< HEAD
        {/* Profiles */}
=======
>>>>>>> d78287fd4f52d1dfa7d98f8f093fdb8226cbf2a2
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
                  >
                    <i className="fas fa-handshake"></i> Connect
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-profiles">
              <i className="fas fa-users"></i>
<<<<<<< HEAD
              <p>No public profiles available</p>
=======
              <p>No public profiles available matching your criteria</p>
>>>>>>> d78287fd4f52d1dfa7d98f8f093fdb8226cbf2a2
            </div>
          )}
        </div>

<<<<<<< HEAD
        {/* Pagination */}
=======
>>>>>>> d78287fd4f52d1dfa7d98f8f093fdb8226cbf2a2
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

<<<<<<< HEAD
      {/* Google Login Modal */}
      {showLoginPopup && (
        <GoogleLoginModal onClose={() => setShowLoginPopup(false)} />
=======
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
>>>>>>> d78287fd4f52d1dfa7d98f8f093fdb8226cbf2a2
      )}
    </div>
  );
};

<<<<<<< HEAD
export default HomePage;
=======
export default HomePage;
>>>>>>> d78287fd4f52d1dfa7d98f8f093fdb8226cbf2a2
