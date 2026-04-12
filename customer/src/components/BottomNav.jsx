import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Search, Heart, User } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { name: 'Nearby', path: '/', icon: Compass },
    { name: 'Explore', path: '/explore', icon: Search },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <nav className="glass-nav" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '0.75rem var(--spacing-md)',
      display: 'flex',
      justifyContent: 'space-around',
      zIndex: 'var(--z-bottom-nav)',
      paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))',
    }}>
      {navItems.map((item) => (
        <NavLink 
          key={item.name} 
          to={item.path}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            textDecoration: 'none',
            color: isActive ? 'var(--primary)' : 'var(--text-light)',
            transition: 'color 0.2s',
          })}
        >
          {({ isActive }) => (
            <>
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} fill={isActive && (item.icon === Heart || item.icon === User) ? 'currentColor' : 'none'} />
              <span style={{ fontSize: '0.7rem', fontWeight: isActive ? 600 : 500 }}>{item.name}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
