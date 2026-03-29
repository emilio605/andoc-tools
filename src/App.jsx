import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import Brief from './pages/Brief';
import BriefIA from './pages/BriefIA';
import Propuesta from './pages/Propuesta';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/brief" element={<Brief />} />
        <Route path="/brief-ia" element={<BriefIA />} />
        <Route path="/propuesta" element={<Propuesta />} />
      </Routes>
    </Router>
  );
}
