import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import RoadmapsSection from './components/RoadmapsSection';
import ProjectsSection from './components/ProjectsSection';
import CommunitySection from './components/CommunitySection';
import Profile from './pages/Profile';
import RoadmapDetail from './pages/RoadmapDetail';
import ResourceDetail from './pages/ResourceDetail';
import LoginPage from './pages/LoginPage';
import Footer from './components/Footer';

const Home: React.FC = () => (
    <main className="bg-white min-h-screen">
        <Hero />
        <RoadmapsSection />
        <ProjectsSection />
        <CommunitySection />
    </main>
);

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-white text-[#0f172a] font-sans">
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/roadmap/:roadmapId" element={<RoadmapDetail />} />
                <Route path="/resource/:resourceId" element={<ResourceDetail />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
            <Footer />
        </div>
    );
};

export default App;
