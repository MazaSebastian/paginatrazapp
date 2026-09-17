import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TrazappCorporateLanding } from '@/pages/TrazappCorporateLanding';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
// @ts-ignore
import DarkVeil from './components/DarkVeil';
import Ribbons from './components/Ribbons';
import { Toaster } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import './App.css';

function App() {
  const isMobile = useIsMobile();
  return (
    <Router>
      <div className="w-full min-h-screen bg-[#060913] text-white selection:bg-emerald-500/30 selection:text-white">
        {/* Subtle Ambient Veil */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-30 mix-blend-screen transition-opacity duration-1000">
          {!isMobile && <DarkVeil hueShift={80} speed={0.25} noiseIntensity={0.02} />}
        </div>

        {/* Global Ribbons Effect with Bio-tech Emerald tones */}
        <div className="fixed inset-0 z-0 transition-opacity duration-1000 pointer-events-none opacity-30">
          <Ribbons
            baseThickness={3}
            enableFade={true}
            enableShaderEffect={true}
            maxAge={350}
            speedMultiplier={0.3}
            colors={['#10B981', '#059669']}
          />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Routes>
            <Route path="/" element={<TrazappCorporateLanding />} />
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
