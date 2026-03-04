import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <h1>♥ SHMS</h1>
      <ul className="nav-links">
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/health-history">History</Link></li>
        <li><Link to="/stats">Stats</Link></li>
        <li><Link to="/alerts">Alerts</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
      <div className="nav-right">
        <div className="nav-user">{user?.username}</div>
        <button className="btn btn-secondary" onClick={onLogout} style={{ padding: '8px 16px' }}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
