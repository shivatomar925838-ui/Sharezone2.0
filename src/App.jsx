import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { VoiceProvider } from './components/VoiceAssistant';
import VoiceAssistantButton from './components/VoiceAssistant';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import ChatBot from './components/ChatBot';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DonorDashboard from './pages/DonorDashboard';
import NgoDashboard from './pages/NgoDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import ImpactDashboard from './pages/ImpactDashboard';
import InfluencerPage from './pages/InfluencerPage';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={`/dashboard/${user?.role}`} replace />;
  }

  return children;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={
        isAuthenticated ? <Navigate to={`/dashboard/${user?.role}`} replace /> : <Login />
      } />
      <Route path="/signup" element={
        isAuthenticated ? <Navigate to={`/dashboard/${user?.role}`} replace /> : <Signup />
      } />
      <Route path="/impact" element={<ImpactDashboard />} />
      <Route path="/influencer" element={<InfluencerPage />} />
      <Route path="/dashboard/donor" element={
        <ProtectedRoute allowedRoles={['donor']}>
          <DonorDashboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/ngo" element={
        <ProtectedRoute allowedRoles={['ngo']}>
          <NgoDashboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/volunteer" element={
        <ProtectedRoute allowedRoles={['volunteer']}>
          <VolunteerDashboard />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <VoiceProvider>
          <AuthProvider>
            <AppProvider>
              <Navbar />
              <ToastContainer />
              <VoiceAssistantButton />
              <ChatBot />
              <AppRoutes />
            </AppProvider>
          </AuthProvider>
        </VoiceProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
