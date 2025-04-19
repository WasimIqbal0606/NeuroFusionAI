// Dashboard.jsx - Main dashboard component

import React from 'react';

const Dashboard = ({ systemStatus, queryResponse, isLoading, error }) => {
  return (
    <div className="dashboard" id="dashboard">
      <h2>Neural Command Center</h2>
      
      <div className="dashboard-grid">
        {/* Response card */}
        <div className="card response-card">
          <div className="card-header">
            <h3>System Response</h3>
            {isLoading && <div className="loading-indicator">Processing...</div>}
          </div>
          
          <div className="card-content">
            {error ? (
              <div className="error-message">
                <h4>Error</h4>
                <p>{error}</p>
              </div>
            ) : isLoading ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Neural networks processing query...</p>
              </div>
            ) : queryResponse ? (
              <div className="query-response">
                <div className="response-result">
                  <p>{queryResponse.result}</p>
                </div>
                
                {queryResponse.confidence && (
                  <div className="confidence-meter">
                    <span className="label">Confidence:</span>
                    <div className="meter">
                      <div 
                        className="meter-fill" 
                        style={{ width: `${queryResponse.confidence * 100}%` }}
                      ></div>
                    </div>
                    <span className="value">{Math.round(queryResponse.confidence * 100)}%</span>
                  </div>
                )}
                
                {queryResponse.reasoning_path && (
                  <div className="reasoning-path">
                    <h4>Reasoning Path</h4>
                    <ul>
                      {queryResponse.reasoning_path.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="placeholder-message">
                <p>Ask a question or issue a command to interact with NeuroFusionOS</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Active Agents card */}
        <div className="card agents-card">
          <div className="card-header">
            <h3>Active Agents</h3>
          </div>
          
          <div className="card-content">
            {systemStatus.active_agents && systemStatus.active_agents.length > 0 ? (
              <ul className="agent-list">
                {systemStatus.active_agents.map((agent, index) => (
                  <li key={index} className="agent-item">
                    <span className="agent-icon">●</span>
                    <span className="agent-name">{agent}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No agents currently active</p>
            )}
          </div>
        </div>
        
        {/* Memory Utilization card */}
        <div className="card memory-card">
          <div className="card-header">
            <h3>Memory Utilization</h3>
          </div>
          
          <div className="card-content">
            {systemStatus.memory_usage ? (
              <div className="memory-stats">
                <div className="memory-stat">
                  <span className="label">Heap Used:</span>
                  <span className="value">
                    {Math.round(systemStatus.memory_usage.heapUsed / 1024 / 1024)} MB
                  </span>
                </div>
                
                <div className="memory-stat">
                  <span className="label">Heap Total:</span>
                  <span className="value">
                    {Math.round(systemStatus.memory_usage.heapTotal / 1024 / 1024)} MB
                  </span>
                </div>
                
                <div className="memory-stat">
                  <span className="label">External:</span>
                  <span className="value">
                    {Math.round(systemStatus.memory_usage.external / 1024 / 1024)} MB
                  </span>
                </div>
                
                <div className="memory-meter">
                  <div 
                    className="meter-fill" 
                    style={{ 
                      width: `${(systemStatus.memory_usage.heapUsed / systemStatus.memory_usage.heapTotal) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ) : (
              <p>Loading memory data...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;