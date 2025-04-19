// App.jsx - Main application component

import React, { useState, useEffect } from 'react';
import NeuralVisualization from './components/NeuralVisualization.jsx';
import Header from './components/Header.jsx';
import CommandInterface from './components/CommandInterface.jsx';
import Dashboard from './components/Dashboard.jsx';
import SystemMonitor from './components/SystemMonitor.jsx';

const App = () => {
  const [systemStatus, setSystemStatus] = useState({
    status: 'initializing',
    memory_usage: {},
    active_agents: [],
    system_version: ''
  });
  
  const [queryResponse, setQueryResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch system status on mount
  useEffect(() => {
    fetchSystemStatus();
    
    // Set up polling for system status
    const intervalId = setInterval(fetchSystemStatus, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Fetch system status from API
  const fetchSystemStatus = async () => {
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      setSystemStatus(data);
    } catch (err) {
      console.error('Error fetching system status:', err);
      setError('Failed to connect to NeuroFusionOS backend');
    }
  };
  
  // Process query through backend
  const processQuery = async (query) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'An error occurred while processing your query');
      }
      
      setQueryResponse(data.result);
    } catch (err) {
      console.error('Error processing query:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="neural-interface">
      {/* 3D visualization background */}
      <div className="visualization-container">
        <NeuralVisualization 
          systemStatus={systemStatus}
          queryResponse={queryResponse}
        />
      </div>
      
      {/* Interface overlay */}
      <div className="interface-overlay">
        <Header 
          systemStatus={systemStatus}
        />
        
        <div className="main-content">
          <Dashboard 
            systemStatus={systemStatus}
            queryResponse={queryResponse}
            isLoading={isLoading}
            error={error}
          />
          
          <SystemMonitor 
            systemStatus={systemStatus}
          />
        </div>
        
        <CommandInterface 
          onSubmitQuery={processQuery}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default App;