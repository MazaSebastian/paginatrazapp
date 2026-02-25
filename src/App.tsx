import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/sections/Hero';
import { TraceabilityTimeline } from '@/sections/TraceabilityTimeline';
// import { AIIntegration } from '@/sections/AIIntegration';
import { Features } from '@/sections/Features';
import { Pricing } from '@/sections/Pricing';
import { Footer } from '@/sections/Footer';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import Aurora from './components/Aurora';
import Ribbons from './components/Ribbons';
import { Toaster } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import './App.css';

function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TraceabilityTimeline />
        <Features />
        {/* <AIIntegration /> */}
        <Pricing />
      </main>
      <Footer />
    </>
  );
}

function App() {
  const isMobile = useIsMobile();
  return (
    <Router>
      <div className="w-full min-h-screen bg-background text-white">
        <div className="fixed inset-0 z-0 pointer-events-none opacity-60 mix-blend-screen transition-opacity duration-1000">
          {!isMobile && <Aurora colorStops={["#16A34A", "#4ADE80", "#047857"]} amplitude={1.2} blend={1} />}
        </div>


        {/* Global Ribbons Effect */}
        <div className="fixed inset-0 z-0 transition-opacity duration-1000">
          <Ribbons
            baseThickness={4}
            enableFade={true}
            enableShaderEffect={true}
            maxAge={400}
            speedMultiplier={0.49}
            colors={['#22C55E']} // TrazAPP Green
          />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>

        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
