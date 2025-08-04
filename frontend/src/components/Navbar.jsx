import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/dashboard" className="navbar-brand">
            Wellness Platform
          </Link>
          
          <div className="navbar-nav">
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/my-sessions" 
              className={`nav-link ${isActive('/my-sessions') ? 'active' : ''}`}
            >
              My Sessions
            </Link>
            <Link 
              to="/editor" 
              className={`nav-link ${isActive('/editor') ? 'active' : ''}`}
            >
              Create Session
            </Link>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', color: '#6c757d' }}>
                <User size={16} style={{ marginRight: '4px' }} />
                {user?.email}
              </span>
              <button 
                onClick={logout}
                className="btn btn-secondary"
                style={{ padding: '8px 12px', fontSize: '12px' }}
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 