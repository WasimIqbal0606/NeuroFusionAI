// SystemMonitor.jsx - System monitoring component

import React from 'react';

const SystemMonitor = ({ systemStatus }) => {
  // Format uptime from seconds to human-readable format
  const formatUptime = (seconds) => {
    if (!seconds && seconds !== 0) return 'N/A';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    let formatted = '';
    if (days > 0) formatted += `${days}d `;
    if (hours > 0 || days > 0) formatted += `${hours}h `;
    if (minutes > 0 || hours > 0 || days > 0) formatted += `${minutes}m `;
    formatted += `${remainingSeconds}s`;
    
    return formatted;
  };
  
  return (
    <div className="system-monitor">
      <div className="card">
        <div className="card-header">
          <h3>System Monitor</h3>
          <span className="timestamp">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
        
        <div className="card-content">
          <div className="monitor-grid">
            <div className="monitor-stat">
              <span className="label">Status:</span>
              <span className={`value status-${systemStatus.status}`}>
                {systemStatus.status}
              </span>
            </div>
            
            <div className="monitor-stat">
              <span className="label">Uptime:</span>
              <span className="value">
                {formatUptime(systemStatus.uptime)}
              </span>
            </div>
            
            <div className="monitor-stat">
              <span className="label">Active Agents:</span>
              <span className="value">
                {systemStatus.active_agents ? systemStatus.active_agents.length : 0}
              </span>
            </div>
            
            <div className="monitor-stat">
              <span className="label">Memory Usage:</span>
              <span className="value">
                {systemStatus.memory_usage ? 
                  `${Math.round(systemStatus.memory_usage.heapUsed / 1024 / 1024)} / 
                   ${Math.round(systemStatus.memory_usage.heapTotal / 1024 / 1024)} MB` : 
                  'N/A'}
              </span>
            </div>
            
            <div className="monitor-stat">
              <span className="label">Last Updated:</span>
              <span className="value">
                {systemStatus.timestamp ? 
                  new Date(systemStatus.timestamp).toLocaleTimeString() : 
                  'N/A'}
              </span>
            </div>
            
            <div className="monitor-stat">
              <span className="label">Version:</span>
              <span className="value">
                {systemStatus.system_version || 'N/A'}
              </span>
            </div>
          </div>
          
          <div className="system-actions">
            <button className="action-button">Restart Agents</button>
            <button className="action-button">Clear Memory</button>
            <button className="action-button">System Diagnostics</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;