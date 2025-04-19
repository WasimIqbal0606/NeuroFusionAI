// CommandInterface.jsx - User input interface component

import React, { useState } from 'react';

const CommandInterface = ({ onSubmitQuery, isLoading }) => {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    
    onSubmitQuery(query);
    setQuery('');
  };
  
  return (
    <div className="command-interface">
      <form className="command-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask NeuroFusionOS a question or issue a command..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Submit'}
        </button>
      </form>
      
      <div className="command-suggestions">
        <p className="suggestion-label">Try asking:</p>
        <div className="suggestions">
          <button 
            className="suggestion" 
            onClick={() => setQuery("Explain how quantum computing enhances neural networks")}>
            Explain how quantum computing enhances neural networks
          </button>
          <button 
            className="suggestion" 
            onClick={() => setQuery("Analyze the relationship between consciousness and emergent properties")}>
            Analyze the relationship between consciousness and emergent properties
          </button>
          <button 
            className="suggestion" 
            onClick={() => setQuery("Generate a visualization of my knowledge graph")}>
            Generate a visualization of my knowledge graph
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommandInterface;