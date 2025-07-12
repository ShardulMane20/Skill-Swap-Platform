import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import "./ProfileSetup.css";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // adjust path if needed

import {
  FiUser,
  FiMapPin,
  FiCode,
  FiTool,
  FiClock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const ProfileSetup = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [skillsOffered, setSkillsOffered] = useState("");
  const [skillsWanted, setSkillsWanted] = useState("");
  const [availability, setAvailability] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => setCurrentStep(currentStep + 1);
  const handleBack = () => setCurrentStep(currentStep - 1);

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (auth.currentUser) {
    const userRef = doc(db, "users", auth.currentUser.uid);

    const userData = {
      name,
      location,
      skillsOffered: skillsOffered.split(",").map((skill) => skill.trim()).filter(Boolean),
      skillsWanted: skillsWanted.split(",").map((skill) => skill.trim()).filter(Boolean),
      availability,
      isPublic,
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      createdAt: new Date()
    };

    try {
      await setDoc(userRef, userData);
      console.log("Profile saved successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    }
  } else {
    navigate("/login");
  }
};


  return (
    <div className="profile-setup">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">SkillSwap</h1>
          <div className="progress-steps">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`step ${step === currentStep ? "active" : ""} ${
                  step < currentStep ? "completed" : ""
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="setup-container">
        <div className="setup-header">
          <h2>
            {currentStep === 1
              ? "Basic Information"
              : currentStep === 2
              ? "Skills & Availability"
              : "Visibility"}
          </h2>
          <p>Complete your profile to start connecting with others</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {currentStep === 1 && (
            <div className="form-step">
              <div className="form-group">
                <label>Full Name *</label>
                <div className="input-with-icon">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Location</label>
                <div className="input-with-icon">
                  <FiMapPin className="input-icon" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="next-btn"
                  onClick={handleNext}
                  disabled={!name}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="form-step">
              <div className="form-group">
                <label>Skills You Offer *</label>
                <div className="input-with-icon">
                  <FiTool className="input-icon" />
                  <input
                    type="text"
                    value={skillsOffered}
                    onChange={(e) => setSkillsOffered(e.target.value)}
                    required
                    placeholder="e.g., Photoshop, JavaScript (comma separated)"
                  />
                </div>
                <div className="hint">Add at least 3 relevant skills</div>
              </div>

              <div className="form-group">
                <label>Skills You're Looking For *</label>
                <div className="input-with-icon">
                  <FiCode className="input-icon" />
                  <input
                    type="text"
                    value={skillsWanted}
                    onChange={(e) => setSkillsWanted(e.target.value)}
                    required
                    placeholder="e.g., Graphic Design, Python (comma separated)"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Your Availability *</label>
                <div className="input-with-icon">
                  <FiClock className="input-icon" />
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    required
                  >
                    <option value="">Select your availability</option>
                    <option value="Weekends">Weekends</option>
                    <option value="Evenings">Evenings</option>
                    <option value="Weekdays">Weekdays</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="back-btn" onClick={handleBack}>
                  Back
                </button>
                <button
                  type="button"
                  className="next-btn"
                  onClick={handleNext}
                  disabled={!skillsOffered || !skillsWanted || !availability}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="form-step">
              <div className="form-group">
                <label>Profile Visibility *</label>
                <div className="visibility-options">
                  <div
                    className={`visibility-option ${isPublic ? "selected" : ""}`}
                    onClick={() => setIsPublic(true)}
                  >
                    <FiEye className="option-icon" />
                    <h3>Public</h3>
                    <p>Your profile will be visible to everyone</p>
                  </div>
                  <div
                    className={`visibility-option ${!isPublic ? "selected" : ""}`}
                    onClick={() => setIsPublic(false)}
                  >
                    <FiEyeOff className="option-icon" />
                    <h3>Private</h3>
                    <p>Only you can see your profile</p>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="back-btn" onClick={handleBack}>
                  Back
                </button>
                <button type="submit" className="submit-btn">
                  Complete Profile
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
