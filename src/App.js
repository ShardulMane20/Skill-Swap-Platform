import { Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import HomePage from './component/HomePage';
import ProfileSetup from './component/ProfileSetup';
import SkillSwapRequest from './SkillSwapRequest';  
import SkillSwapProposal from './SkillSwapProposal'; // Importing SkillSwapProposal component
import AdminPanel from './component/AdminPanel';  

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/profile-setup" element={<ProfileSetup />} /> {/* New route */}
      <Route path="/skill-swap-requests" element={<SkillSwapRequest />} /> {/* New route for SkillSwapRequest */}
      <Route path="/skill-swap-proposal" element={<SkillSwapProposal />} /> {/* New route for SkillSwapProposal */}
      <Route path="/admin-panel" element={<AdminPanel />} /> {/* New route for AdminPanel */}
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default App;