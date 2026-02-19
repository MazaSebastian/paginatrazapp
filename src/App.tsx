import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/sections/Hero';
import { TraceabilityTimeline } from '@/sections/TraceabilityTimeline';
import { AIIntegration } from '@/sections/AIIntegration';
import { Features } from '@/sections/Features';
import { Pricing } from '@/sections/Pricing';
import { Footer } from '@/sections/Footer';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { ParticleBackground } from './components/ParticleBackground';
import './App.css';

function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TraceabilityTimeline />
        <AIIntegration />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark text-white overflow-x-hidden relative">
        <ParticleBackground />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
