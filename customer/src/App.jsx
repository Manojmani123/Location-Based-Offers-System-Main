import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
// Protected route for customer auth
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="app-container flex justify-center items-center"><div>Loading...</div></div>;
  if (!user) {
    window.location.href = '/login';
    return null;
  }
  return children;
}
import { LocationProvider } from './context/LocationContext';

import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Explore from './pages/Explore';
import OfferDetails from './pages/OfferDetails';
import Register from './pages/Register';
import Login from './pages/Login';
import './App.css';

// A layout component to wrap pages that require bottom navigation
const MainLayout = () => {
  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  );
};

// Placeholder for Saved
const Saved = () => <div className="app-container flex justify-center items-center" style={{ paddingTop: '50px' }}><h2>Saved Offers Coming Soon</h2></div>;

const Profile = () => {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <div className="app-container flex flex-col items-center" style={{ paddingTop: '50px', maxWidth: 400, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24 }}>Profile</h2>
      <div className="profile-card" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '2rem', width: '100%', marginBottom: 24 }}>
        <div style={{ marginBottom: 12 }}><b>Name:</b> {user.name}</div>
        <div style={{ marginBottom: 12 }}><b>Email:</b> {user.email}</div>
        <div style={{ marginBottom: 12 }}><b>Role:</b> {user.role}</div>
        <div style={{ marginBottom: 12 }}><b>Location:</b> [Lng: {user.location?.coordinates?.[0] ?? 0}, Lat: {user.location?.coordinates?.[1] ?? 0}]</div>
        <div style={{ marginBottom: 12 }}><b>Joined:</b> {new Date(user.createdAt).toLocaleString()}</div>
      </div>
      <button className="auth-btn" style={{ width: '100%' }} onClick={() => { logout(); window.location.href = '/login'; }}>Logout</button>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
              <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Route>
            {/* Auth routes (no bottom nav) */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            {/* Offer details takes up full screen, no bottom nav */}
            <Route path="/offer/:id" element={<OfferDetails />} />
          </Routes>
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
