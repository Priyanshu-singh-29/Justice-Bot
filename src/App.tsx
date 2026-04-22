import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { Dashboard } from './pages/Dashboard';
import { UploadCase } from './pages/UploadCase';
import { ReportPage } from './pages/ReportPage';
import { AdminPanel } from './pages/AdminPanel';
import { CasesList } from './pages/CasesList';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { useEffect, useState } from 'react';

function App() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <AuthProvider>
      <Router>
        {/* Container mapping mouse coords to CSS variables */}
        <div 
          className="min-h-screen bg-slate-950 text-slate-100 relative"
          style={{ 
            '--mouse-x': `${mousePos.x}px`, 
            '--mouse-y': `${mousePos.y}px` 
          } as React.CSSProperties}
        >
          {/* Global Dotted Background Mask Effect */}
          <div className="dot-pattern-overlay" />
          
          <div className="relative z-10">
            <Navigation />
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/cases" element={<ProtectedRoute><CasesList /></ProtectedRoute>} />
            <Route path="/upload" element={<ProtectedRoute><UploadCase /></ProtectedRoute>} />
            <Route path="/report/:caseId" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />

            {/* Admin Only */}
            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
