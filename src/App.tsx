import { Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import RoadmapsSection from './components/RoadmapsSection';
import ProjectsSection from './components/ProjectsSection';
import CommunitySection from './components/CommunitySection';
import ContactSection from './components/ContactSection';
import NavBar from './components/NavBar';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import './index.css';

function Dashboard() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <NavBar />
      <Hero />
      <main>
        <RoadmapsSection />
        <ProjectsSection />
        <CommunitySection />
        <ContactSection />
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;