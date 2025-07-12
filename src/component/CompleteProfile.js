import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Box,
  Paper,
  FormControlLabel,
  Switch,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert
} from '@mui/material';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function CompleteProfile() {
  const [tempUser, setTempUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsWanted, setSkillsWanted] = useState([]);
  const [currentSkillOffered, setCurrentSkillOffered] = useState('');
  const [currentSkillWanted, setCurrentSkillWanted] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm({
    defaultValues: {
      name: '',
      location: '',
      availability: '',
      isPublic: true,
    },
  });

  // Check for tempUser in sessionStorage
  useEffect(() => {
    const userData = sessionStorage.getItem('tempUser');
    if (!userData) {
      console.error('No user data found in sessionStorage');
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (!user?.uid) {
        throw new Error('Invalid user data');
      }
      setTempUser(user);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleAddSkillOffered = () => {
    if (currentSkillOffered.trim() && !skillsOffered.includes(currentSkillOffered.trim())) {
      setSkillsOffered([...skillsOffered, currentSkillOffered.trim()]);
      setCurrentSkillOffered('');
    }
  };

  const handleAddSkillWanted = () => {
    if (currentSkillWanted.trim() && !skillsWanted.includes(currentSkillWanted.trim())) {
      setSkillsWanted([...skillsWanted, currentSkillWanted.trim()]);
      setCurrentSkillWanted('');
    }
  };

  const handleDeleteSkillOffered = (skill) => {
    setSkillsOffered(skillsOffered.filter((s) => s !== skill));
  };

  const handleDeleteSkillWanted = (skill) => {
    setSkillsWanted(skillsWanted.filter((s) => s !== skill));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setProfilePhoto(file);
      setSubmitError('');
    } else {
      setSubmitError('Please upload a valid image file');
    }
  };

  const onSubmit = async (data) => {
    if (!tempUser?.uid) {
      setSubmitError('User authentication error. Please log in again.');
      navigate('/login');
      return;
    }

    if (skillsOffered.length === 0 || skillsWanted.length === 0) {
      setSubmitError('Please add at least one skill offered and one skill wanted.');
      return;
    }

    try {
      setSubmitError('');
      let photoURL = null;

      if (profilePhoto) {
        const storage = getStorage();
        const storageRef = ref(storage, `profile_photos/${tempUser.uid}/${profilePhoto.name}`);
        await uploadBytes(storageRef, profilePhoto);
        photoURL = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, 'users', tempUser.uid), {
        uid: tempUser.uid,
        email: tempUser.email,
        name: data.name,
        location: data.location || '',
        profilePhoto: photoURL || '',
        skillsOffered,
        skillsWanted,
        availability: data.availability,
        isPublic: data.isPublic,
        profileComplete: true,
        createdAt: serverTimestamp(),
      });

      sessionStorage.removeItem('tempUser');
      setSuccessMessage('Profile completed successfully! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSubmitError(error.message || 'Failed to save profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
          Complete Your Profile
        </Typography>

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            {...register('name', {
              required: 'Name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Location (Optional)"
            fullWidth
            margin="normal"
            {...register('location')}
          />

          <Box sx={{ my: 2 }}>
            <Button variant="outlined" component="label" fullWidth>
              {profilePhoto ? 'Change Profile Photo' : 'Upload Profile Photo (Optional)'}
              <input type="file" accept="image/*" hidden onChange={handlePhotoUpload} />
            </Button>
            {profilePhoto && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: {profilePhoto.name}
              </Typography>
            )}
          </Box>

          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>
              Skills You Offer
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <TextField
                label="Add skill"
                fullWidth
                value={currentSkillOffered}
                onChange={(e) => setCurrentSkillOffered(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkillOffered()}
              />
              <IconButton 
                color="primary" 
                onClick={handleAddSkillOffered} 
                disabled={!currentSkillOffered.trim()}
              >
                <AddCircleIcon />
              </IconButton>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {skillsOffered.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  onDelete={() => handleDeleteSkillOffered(skill)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
            {skillsOffered.length === 0 && (
              <FormHelperText error>At least one skill is required</FormHelperText>
            )}
          </Box>

          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>
              Skills You Want
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <TextField
                label="Add skill"
                fullWidth
                value={currentSkillWanted}
                onChange={(e) => setCurrentSkillWanted(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkillWanted()}
              />
              <IconButton 
                color="secondary" 
                onClick={handleAddSkillWanted} 
                disabled={!currentSkillWanted.trim()}
              >
                <AddCircleIcon />
              </IconButton>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {skillsWanted.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  onDelete={() => handleDeleteSkillWanted(skill)}
                  color="secondary"
                  variant="outlined"
                />
              ))}
            </Box>
            {skillsWanted.length === 0 && (
              <FormHelperText error>At least one skill is required</FormHelperText>
            )}
          </Box>

          <FormControl fullWidth margin="normal" error={!!errors.availability}>
            <InputLabel>Availability</InputLabel>
            <Select
              {...register('availability', { required: 'Availability is required' })}
              label="Availability"
            >
              <MenuItem value="Weekdays">Weekdays</MenuItem>
              <MenuItem value="Weekends">Weekends</MenuItem>
              <MenuItem value="Evenings">Evenings</MenuItem>
              <MenuItem value="Flexible">Flexible</MenuItem>
            </Select>
            {errors.availability && (
              <FormHelperText>{errors.availability.message}</FormHelperText>
            )}
          </FormControl>

          <FormControlLabel
            control={<Switch {...register('isPublic')} defaultChecked />}
            label="Public Profile"
            sx={{ my: 2, display: 'block' }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={isSubmitting || skillsOffered.length === 0 || skillsWanted.length === 0}
            sx={{ mt: 3 }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Complete Profile'
            )}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default CompleteProfile;