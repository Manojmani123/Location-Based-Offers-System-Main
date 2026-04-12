import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireApproval = true }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the route strictly needs approval but user is not approved
  if (requireApproval && !user.isApproved) {
    return <Navigate to="/pending-approval" replace />;
  }

  // If user is accessing pending page but is already approved
  if (!requireApproval && user.isApproved && location.pathname === '/pending-approval') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
