import { Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import HomePage from './component/HomePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} /> {/* New route for HomePage */}
    </Routes>
  );
}

export default App;