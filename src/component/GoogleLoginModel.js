import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GoogleIcon from '@mui/icons-material/Google';
import './GoogleLoginModal.css';

const GoogleLoginModal = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await signInWithPopup(auth, provider);
      
      // Optional: You can access the user info here
      const user = result.user;
      console.log('Logged in user:', user);
      
      // Navigate to profile page after successful login
      navigate('/profile');
      onClose();
    } catch (err) {
      console.error('Google Login Error:', err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Sign in to SkillSwap</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Continue with Google to connect with others!
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="outlined"
          onClick={handleLogin}
          disabled={loading}
          fullWidth
          size="large"
          startIcon={loading ? <CircularProgress size={20} /> : <GoogleIcon />}
          sx={{
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            color: 'text.primary',
            borderColor: 'divider',
            '&:hover': {
              borderColor: 'text.secondary'
            }
          }}
        >
          {loading ? 'Signing in...' : 'Continue with Google'}
        </Button>

        <Typography variant="caption" component="div" sx={{ mt: 3, color: 'text.secondary' }}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleLoginModal;