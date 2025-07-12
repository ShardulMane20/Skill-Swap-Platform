import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, getDocs, limit, startAfter } from "firebase/firestore";
import "./HomePage.css";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastDoc, setLastDoc] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
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
          where("isPublic", "==", true),
          limit(profilesPerPage)
        );
        if (availability) {
          profilesQuery = query(profilesQuery, where("availability", "==", availability));
        }
        if (lastDoc && currentPage > 1) {
          profilesQuery = query(profilesQuery, startAfter(lastDoc));
        }
        const querySnapshot = await getDocs(profilesQuery);
        const profilesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProfiles(profilesData);
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
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

  const handleLoginPopupClose = () => {
    setShowLoginPopup(false);
  };

  const handleLoginRedirect = () => {
    navigate("/login");
    setShowLoginPopup(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
      navigate("/"); // Redirect to homepage or login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="home-container">
      {/* Enhanced Navbar */}
      <nav className="main-nav">
        <div className="nav-container">
          <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <i className="fas fa-exchange-alt"></i>
            <span>SkillSwap</span>
          </div>
          
          <div className="nav-actions">
            {user ? (
              <div className="user-menu">
                <button className="user-btn" onClick={() => navigate("/profile")}>
                  <i className="fas fa-user-circle"></i>
                  <span>My Profile</span>
                </button>
                <button className="nav-btn logout-btn" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <button className="nav-btn primary" onClick={() => navigate("/profile-setup")}>
                  Sign In
                </button>
              </>
            )}
            <button className="mobile-menu-btn" onClick={toggleMenu}>
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Connect, Collaborate, Grow</h1>
          <p>Find the perfect skill exchange partner and expand your knowledge</p>
        </div>
      </section>

      {/* Main Content */}
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