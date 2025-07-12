import { Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import HomePage from './component/HomePage';
import ProfileSetup from './component/ProfileSetup';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/profile-setup" element={<ProfileSetup />} /> {/* New route */}
    </Routes>
  );
}

export default App;