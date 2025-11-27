import Hero from './components/Hero';
import RoadmapsSection from './components/RoadmapsSection';
import ProjectsSection from './components/ProjectsSection';
import CommunitySection from './components/CommunitySection';
import ContactSection from './components/ContactSection';
import NavBar from './components/NavBar';
import './index.css';

function App() {
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

export default App;