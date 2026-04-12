import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PendingApproval = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center" style={{ minHeight: '100vh', padding: 'var(--spacing-lg)' }}>
      <div className="card glass-panel flex flex-col items-center" style={{ maxWidth: '500px', padding: '3rem var(--spacing-xl)', textAlign: 'center' }}>
        
        <div style={{ position: 'relative', marginBottom: 'var(--spacing-xl)' }}>
          <div className="spinner" style={{ position: 'absolute', width: '80px', height: '80px', top: '-8px', left: '-8px', borderWidth: '4px', opacity: 0.3 }}></div>
          <div style={{ backgroundColor: 'var(--surface-light)', borderRadius: '50%', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={32} color="var(--warning-color)" />
          </div>
        </div>

        <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Approval Pending</h2>
        
        <p style={{ color: 'var(--text-muted)' }}>
          Thank you for registering, <strong>{user?.name || 'Business'}</strong>! 
          Your profile and documentation are currently under review by our super administrators.
        </p>

        <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', color: 'var(--warning-color)', fontSize: '0.875rem', marginBottom: 'var(--spacing-xl)', width: '100%' }}>
          You will receive an email once your account has been approved. Usually takes 1-2 business days.
        </div>

        <button onClick={handleLogout} className="btn btn-secondary w-full">
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default PendingApproval;
