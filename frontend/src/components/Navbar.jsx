import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Navbar.css';

export default function Navbar({ view, setView }) {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully. See you soon! 👋', 'info');
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="nav-logo">
          <div className="nav-drop-icon"><div className="nav-drop" /></div>
          <div>
            <div className="nav-brand">AquaTrack</div>
            <div className="nav-sub">WATER AWARENESS</div>
          </div>
        </div>

        <div className="nav-tabs">
          {['daily', 'weekly'].map(v => (
            <button key={v} className={`nav-tab ${view === v ? 'active' : ''}`}
              onClick={() => setView(v)}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="navbar-right">
        <div className="nav-avatar-wrap" onClick={() => setMenuOpen(o => !o)}>
          <div className="nav-avatar">{initials}</div>
          <div className="nav-user-info">
            <span className="nav-user-name">{user?.name || 'User'}</span>
            <span className="nav-user-email">{user?.email || ''}</span>
          </div>
          <span className="nav-chevron">{menuOpen ? '▴' : '▾'}</span>
        </div>

        {menuOpen && (
          <div className="nav-dropdown">
            <div className="nav-dropdown-header">
              <div className="nav-avatar nav-avatar-lg">{initials}</div>
              <div>
                <div className="nd-name">{user?.name}</div>
                <div className="nd-email">{user?.email}</div>
              </div>
            </div>
            <div className="nav-dropdown-divider" />
            <button className="nd-item" onClick={() => { navigate('/profile/edit'); setMenuOpen(false); }}>
              ✏️ &nbsp;Edit Profile
            </button>
            <button className="nd-item nd-logout" onClick={handleLogout}>
              🚪 &nbsp;Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
