import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import News from './pages/News';
import SplashScreen from './pages/SplashScreen';
import AuthPage from './pages/AuthPage';
import Onboarding from './pages/Onboarding';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // Or a simple spinner
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Main layout for dashboard pages
const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-black text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 h-full relative">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<AuthPage />} />
          
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />

          <Route path="/home" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Home />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/news" element={
            <ProtectedRoute>
              <DashboardLayout>
                <News />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;