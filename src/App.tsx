import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import RoadmapsSection from './components/RoadmapsSection';
import ProjectsSection from './components/ProjectsSection';
import ResourcesSection from './components/ResourcesSection';
import CommunitySection from './components/CommunitySection';
import Profile from './pages/Profile';
import RoadmapDetail from './pages/RoadmapDetail';
import ResourceDetail from './pages/ResourceDetail';
import LoginPage from './pages/LoginPage';
import Onboarding from './pages/Onboarding';
import Students from './pages/Students';
import Footer from './components/Footer';
import ContactSection from './components/ContactSection';
import PrivateRoute from './components/PrivateRoute';

const Home: React.FC = () => {
    const location = useLocation();

    React.useEffect(() => {
        if (location.hash) {
            const id = location.hash.substring(1);
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }, [location]);

    return (
        <main className="bg-white min-h-screen">
            <Hero />
            <RoadmapsSection />
            <ProjectsSection />
            <ResourcesSection />
            <CommunitySection />
            <ContactSection />
        </main>
    );
};

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-white text-[#0f172a] font-sans">
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/profile/:userId"
                    element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/students"
                    element={
                        <PrivateRoute>
                            <Students />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/onboarding"
                    element={
                        <PrivateRoute>
                            <Onboarding />
                        </PrivateRoute>
                    }
                />
                <Route path="/roadmap/:roadmapId" element={<RoadmapDetail />} />
                <Route path="/resource/:resourceId" element={<ResourceDetail />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
            <Footer />
        </div>
    );
};

export default App;
