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
import ScrollToTop from './components/ScrollToTop';

const Home: React.FC = () => {
    const location = useLocation();

    React.useEffect(() => {
        if (location.hash) {
            const id = location.hash.substring(1);
            // Small delay to ensure the DOM is fully rendered
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    const headerOffset = 100; // Account for fixed NavBar
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    }, [location.hash]); // Only run when hash changes

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
            <ScrollToTop />
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
