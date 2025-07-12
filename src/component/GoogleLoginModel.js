import './GoogleLoginModal.css';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';

const GoogleLoginModal = ({ onClose }) => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err) {
      console.error('Google Login Error:', err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Sign in to SkillSwap</h2>
        <p>Continue with Google to connect with others!</p>
        <button className="google-login-btn" onClick={handleLogin}>
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="G" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default GoogleLoginModal;
