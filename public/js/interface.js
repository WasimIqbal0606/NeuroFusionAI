/**
 * NeuroFusionOS Interface Controller
 * Handles user interactions and API communication
 */

class InterfaceController {
  constructor() {
    // Interface elements
    this.queryInput = document.getElementById('query-input');
    this.submitButton = document.getElementById('submit-query');
    this.responseContent = document.getElementById('response-content');
    this.reasoningPathContent = document.getElementById('reasoning-path-content');
    
    // System stats elements
    this.quantumStateValue = document.getElementById('quantum-state-value');
    this.activeAgentsValue = document.getElementById('active-agents-value');
    this.memoryCountValue = document.getElementById('memory-count-value');
    this.systemLoadValue = document.getElementById('system-load-value');
    this.systemUptime = document.getElementById('system-uptime');
    
    // Agent list
    this.agentList = document.getElementById('agent-list');
    
    // State
    this.systemStatus = {};
    this.agents = [];
    this.isProcessingQuery = false;
    this.startTime = Date.now();
    
    // Initialize
    this.init();
  }
  
  /**
   * Initialize the interface controller
   */
  init() {
    // Add event listeners
    this.submitButton.addEventListener('click', this.handleQuerySubmit.bind(this));
    this.queryInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        this.handleQuerySubmit();
      }
    });
    
    // Start periodic status updates
    this.updateSystemStatus();
    setInterval(() => this.updateSystemStatus(), 5000);
    
    // Start uptime counter
    this.updateUptime();
    setInterval(() => this.updateUptime(), 1000);
  }
  
  /**
   * Handle query submission
   */
  handleQuerySubmit() {
    // Get query text
    const queryText = this.queryInput.value.trim();
    
    if (!queryText || this.isProcessingQuery) {
      return;
    }
    
    // Show processing state
    this.isProcessingQuery = true;
    this.submitButton.disabled = true;
    this.responseContent.innerHTML = '<p class="response-text">Processing query...</p>';
    this.reasoningPathContent.innerHTML = '<div class="reasoning-step">Initializing reasoning process...</div>';
    
    // Call API
    fetch('/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: queryText })
    })
    .then(response => response.json())
    .then(data => {
      this.displayResponse(data);
      this.isProcessingQuery = false;
      this.submitButton.disabled = false;
      this.queryInput.value = '';
    })
    .catch(error => {
      console.error('Error processing query:', error);
      this.responseContent.innerHTML = `<p class="response-text">Error: ${error.message}</p>`;
      this.reasoningPathContent.innerHTML = '<div class="reasoning-step">Error occurred during processing</div>';
      this.isProcessingQuery = false;
      this.submitButton.disabled = false;
    });
  }
  
  /**
   * Display response from the system
   * @param {Object} data - Response data
   */
  displayResponse(data) {
    if (data.error) {
      this.responseContent.innerHTML = `<p class="response-text">Error: ${data.error}</p>`;
      return;
    }
    
    const result = data.result;
    
    // Display main response
    let responseHTML = `<p class="response-text">${result.result}</p>`;
    
    // Add quantum confidence indicators
    responseHTML += '<div class="quantum-indicators">';
    
    // Confidence indicator
    const confidence = result.quantum_confidence || result.confidence || 0;
    responseHTML += `
      <div class="quantum-confidence">
        <span class="indicator-label">Quantum Confidence:</span>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${confidence * 100}%"></div>
        </div>
        <span class="indicator-value">${Math.round(confidence * 100)}%</span>
      </div>
    `;
    
    // Uncertainty indicator if available
    if (result.quantum_uncertainty !== undefined) {
      responseHTML += `
        <div class="quantum-confidence">
          <span class="indicator-label">Quantum Uncertainty:</span>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${result.quantum_uncertainty * 100}%"></div>
          </div>
          <span class="indicator-value">${Math.round(result.quantum_uncertainty * 100)}%</span>
        </div>
      `;
    }
    
    responseHTML += '</div>';
    
    // Add alternatives if available
    if (result.alternatives && result.alternatives.length > 0) {
      responseHTML += '<div class="alternative-responses">';
      responseHTML += '<h4>Alternative Responses</h4>';
      
      result.alternatives.forEach(alt => {
        const probability = alt.probability * 100;
        responseHTML += `
          <div class="alternative-item">
            <div class="alternative-header">
              <span class="interference-type ${alt.interferenceType || ''}">${alt.interferenceType || 'Alternative'}</span>
              <span class="alternative-probability">${probability.toFixed(1)}%</span>
            </div>
            <p class="alternative-text">${alt.result}</p>
          </div>
        `;
      });
      
      responseHTML += '</div>';
    }
    
    this.responseContent.innerHTML = responseHTML;
    
    // Display reasoning path
    let reasoningHTML = '';
    
    if (result.reasoning_path) {
      result.reasoning_path.forEach((step, index) => {
        const isQuantum = step.includes('quantum') || step.includes('Quantum');
        reasoningHTML += `
          <div class="reasoning-step ${isQuantum ? 'quantum-step' : ''}">
            <span class="step-number">${index + 1}.</span> ${step}
          </div>
        `;
      });
    }
    
    this.reasoningPathContent.innerHTML = reasoningHTML;
  }
  
  /**
   * Update system status information
   */
  updateSystemStatus() {
    fetch('/api/status')
      .then(response => response.json())
      .then(data => {
        this.systemStatus = data;
        
        // Update system stats
        if (data.quantum_state) {
          this.quantumStateValue.textContent = `${data.quantum_state.dimension} dims`;
        }
        
        if (data.active_agents) {
          this.activeAgentsValue.textContent = data.active_agents.length;
        }
        
        if (data.memory_count !== undefined) {
          this.memoryCountValue.textContent = `${data.memory_count} vectors`;
        }
        
        // Calculate simulated system load
        const load = Math.round(25 + 15 * Math.sin(Date.now() / 10000));
        this.systemLoadValue.textContent = `${load}%`;
        
        // Update agent list
        this.updateAgentList(data.active_agents);
      })
      .catch(error => {
        console.error('Error fetching system status:', error);
      });
  }
  
  /**
   * Update the agent list
   * @param {Array} activeAgents - List of active agent names
   */
  updateAgentList(activeAgents = []) {
    // If no agents data yet, fetch it
    if (this.agents.length === 0) {
      fetch('/api/agents')
        .then(response => response.json())
        .then(data => {
          this.agents = data.agents || [];
          this.renderAgentList(activeAgents);
        })
        .catch(error => {
          console.error('Error fetching agents:', error);
        });
    } else {
      this.renderAgentList(activeAgents);
    }
  }
  
  /**
   * Render the agent list
   * @param {Array} activeAgents - List of active agent names
   */
  renderAgentList(activeAgents = []) {
    // Clear current list
    this.agentList.innerHTML = '';
    
    // Add agent items
    this.agents.forEach(agent => {
      const isActive = activeAgents.includes(agent.name);
      
      const li = document.createElement('li');
      li.className = 'agent-item';
      
      li.innerHTML = `
        <div class="agent-name">${agent.name}</div>
        <div class="agent-status">
          <span class="agent-status-dot ${isActive ? 'status-active' : 'status-inactive'}"></span>
          <button class="agent-toggle">${isActive ? 'Deactivate' : 'Activate'}</button>
        </div>
      `;
      
      // Add toggle event
      const toggleButton = li.querySelector('.agent-toggle');
      toggleButton.addEventListener('click', () => {
        this.toggleAgent(agent.id, isActive);
      });
      
      this.agentList.appendChild(li);
    });
  }
  
  /**
   * Toggle agent activation state
   * @param {string} agentId - ID of the agent to toggle
   * @param {boolean} isActive - Current activation state
   */
  toggleAgent(agentId, isActive) {
    const endpoint = isActive ? 'deactivate' : 'activate';
    
    fetch(`/api/agents/${agentId}/${endpoint}`, {
      method: 'POST'
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Update system status to refresh agent list
          this.updateSystemStatus();
        }
      })
      .catch(error => {
        console.error(`Error ${endpoint}ing agent:`, error);
      });
  }
  
  /**
   * Update the system uptime display
   */
  updateUptime() {
    const now = Date.now();
    const uptime = Math.floor((now - this.startTime) / 1000);
    
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = uptime % 60;
    
    const formattedTime = [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
    
    this.systemUptime.textContent = `Uptime: ${formattedTime}`;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.interfaceController = new InterfaceController();
});