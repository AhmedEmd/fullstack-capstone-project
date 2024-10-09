import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './components/LandingPage/LandingPage';
import MainPage from './components/MainPage/MainPage';
import SearchPage from './components/SearchPage/SearchPage';
import DetailsPage from './components/DetailsPage/DetailsPage';
import AboutPage from './components/AboutPage/AboutPage';
import ContactPage from './components/ContactPage/ContactPage';
import LearnMore from './components/LearnMore/LearnMore';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import Profile from './components/Profile/Profile';
import NotFoundPage from './components/NotFoundPage';
import TermsPage from './components/TermsPage/TermsPage';
import PrivacyPage from './components/PrivacyPage/PrivacyPage';
import './App.css';

// Create a context for authentication
export const AuthContext = React.createContext(null);

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppContent() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Check if the token is expired
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      if (tokenData.exp * 1000 > Date.now()) {
        setIsAuthenticated(true);
      } else {
        // Token is expired, remove it
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <div className="App">
        {!isLandingPage && <Navbar />}
        {isLandingPage ? (
          <Routes>
            <Route path="/" element={<LandingPage />} />
          </Routes>
        ) : (
          <div className="page-content">
            <Routes>
              <Route path="/app" element={<MainPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/learn-more" element={<LearnMore />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              
              {/* Protected routes */}
              <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
              <Route path="/details/:id" element={<ProtectedRoute><DetailsPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        )}
      </div>
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;