import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Tag, Settings, LogOut, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { to: '/offers', icon: Tag, label: 'My Offers' },
    { to: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--surface-color)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'fixed'
    }}>
      {/* Brand Header */}
      <div style={{ padding: 'var(--spacing-xl) var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ backgroundColor: 'var(--primary-color)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
          <Store size={22} color="#fff" />
        </div>
        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>BizAdmin</h3>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: 'var(--spacing-lg) 0', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
        {navLinks.map(link => (
          <NavLink 
            key={link.to} 
            to={link.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              padding: '0.75rem var(--spacing-lg)',
              color: isActive ? 'var(--primary-color)' : 'var(--text-muted)',
              backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
              borderRight: isActive ? '3px solid var(--primary-color)' : '3px solid transparent',
              transition: 'all var(--transition-fast)'
            })}
          >
            <link.icon size={20} />
            <span style={{ fontWeight: 500 }}>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer User Info */}
      <div style={{ padding: 'var(--spacing-lg)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--surface-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-main)' }}>
            {user?.name?.charAt(0) || 'B'}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Approved</p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary w-full" style={{ justifyContent: 'center' }}>
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
