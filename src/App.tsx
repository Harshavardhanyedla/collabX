import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import RoadmapsSection from './components/RoadmapsSection';
import ProjectsSection from './components/ProjectsSection';
import ResourcesSection from './components/ResourcesSection';
import CommunitySection from './components/CommunitySection';
import Profile from './pages/Profile';
const Messages = React.lazy(() => import('./pages/Messages'));
const Notifications = React.lazy(() => import('./pages/Notifications'));
import RoadmapDetail from './pages/RoadmapDetail';
import ResourceDetail from './pages/ResourceDetail';
import LoginPage from './pages/LoginPage';
import Onboarding from './pages/Onboarding';
import Students from './pages/Students';
import ContactSection from './components/ContactSection';
import PrivateRoute from './components/PrivateRoute';
import ScrollToTop from './components/ScrollToTop';
import MainLayout from './components/MainLayout';
import HomeFeed from './components/HomeFeed';
import Projects from './pages/Projects';
import Resources from './pages/Resources';
import Roadmaps from './pages/Roadmaps';

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

    // If there's a hash, show the traditional landing page sections
    // Otherwise, show the new feed experience
    if (location.hash) {
        return (
            <main className="bg-white min-h-screen">
                <Hero />
                <div id="roadmaps"><RoadmapsSection /></div>
                <div id="projects"><ProjectsSection /></div>
                <div id="resources"><ResourcesSection /></div>
                <CommunitySection />
                <ContactSection />
            </main>
        );
    }

    return (
        <MainLayout>
            <HomeFeed />
        </MainLayout>
    );
};

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#f3f2ef] text-[#0f172a] font-sans">
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
                    path="/projects"
                    element={
                        <PrivateRoute>
                            <Projects />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/resources"
                    element={
                        <PrivateRoute>
                            <Resources />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/roadmaps"
                    element={
                        <PrivateRoute>
                            <Roadmaps />
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
                <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
                <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
                <Route path="/roadmap/:roadmapId" element={<RoadmapDetail />} />
                <Route path="/resource/:resourceId" element={<ResourceDetail />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
            {/* Footer is typically not shown on the main feed in LinkedIn-style apps, 
                but let's keep it for now or move it to sidebars */}
        </div>
    );
};

export default App;
