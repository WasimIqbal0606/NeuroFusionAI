// Header.jsx - Application header component

import React from 'react';

const Header = ({ systemStatus }) => {
  return (
    <header className="header">
      <div className="logo">
        <h1>NeuroFusionOS</h1>
      </div>
      
      <div className="system-status">
        <span className={`status-indicator ${systemStatus.status === 'online' ? 'online' : 'offline'}`}>
          {systemStatus.status === 'online' ? '●' : '○'} 
          {systemStatus.status === 'online' ? 'System Online' : 'Initializing...'}
        </span>
        {systemStatus.system_version && (
          <span className="version">v{systemStatus.system_version}</span>
        )}
      </div>
      
      <nav className="nav-links">
        <a href="#dashboard">Dashboard</a>
        <a href="#memory">Memory</a>
        <a href="#agents">Agents</a>
        <a href="#quantum">Quantum</a>
        <a href="#visualization">Visualization</a>
      </nav>
    </header>
  );
};

export default Header;