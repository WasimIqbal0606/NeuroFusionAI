/**
 * NeuroFusionOS Main Script
 * Initializes and coordinates all system components
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('NeuroFusionOS initializing...');
  
  // System components to initialize
  const components = {
    neuralVisualizer: null,
    quantumCircuit: null,
    interfaceController: null,
    emotionEngine: null
  };
  
  // Initialize components
  initializeSystem();
  
  /**
   * Initialize all system components
   */
  function initializeSystem() {
    // Initialize visualizer (if container exists)
    if (document.getElementById('visualization-canvas')) {
      components.neuralVisualizer = new NeuralVisualizer('visualization-canvas');
      console.log('Neural network visualizer initialized');
    }
    
    // Initialize quantum circuit
    if (document.getElementById('circuit-display')) {
      components.quantumCircuit = new QuantumCircuit();
      console.log('Quantum circuit initialized');
    }
    
    // Initialize interface controller
    components.interfaceController = new InterfaceController();
    console.log('Interface controller initialized');
    
    // Initialize emotion engine
    components.emotionEngine = new EmotionEngine();
    console.log('Emotion engine initialized');
    
    // Set up event listeners for cross-component communication
    setupEventListeners();
    
    console.log('NeuroFusionOS initialization complete');
  }
  
  /**
   * Set up event listeners for component interactions
   */
  function setupEventListeners() {
    // Handle query events for emotion engine
    document.getElementById('submit-query')?.addEventListener('click', () => {
      const query = document.getElementById('query-input')?.value || '';
      if (components.emotionEngine && query) {
        components.emotionEngine.analyzeEmotion(query);
      }
    });
    
    // Listen for visualization toggle
    document.getElementById('toggle-quantum-effects')?.addEventListener('click', () => {
      console.log('Quantum effects toggled');
    });
    
    // Set up system command events
    setupSystemCommands();
  }
  
  /**
   * Set up system command listeners
   */
  function setupSystemCommands() {
    const queryInput = document.getElementById('query-input');
    
    if (queryInput) {
      queryInput.addEventListener('keydown', (event) => {
        // Check for special system commands
        if (event.key === 'Enter' && queryInput.value.startsWith('/')) {
          const command = queryInput.value.toLowerCase();
          
          // Handle different system commands
          if (command === '/reset') {
            event.preventDefault();
            resetSystem();
            queryInput.value = '';
            return false;
          } else if (command === '/help') {
            event.preventDefault();
            showHelpModal();
            queryInput.value = '';
            return false;
          } else if (command === '/status') {
            event.preventDefault();
            showFullStatus();
            queryInput.value = '';
            return false;
          }
        }
      });
    }
  }
  
  /**
   * Reset the system state
   */
  function resetSystem() {
    console.log('Resetting system...');
    
    // Create a "processing" notification
    showNotification('Resetting system...', 'info');
    
    // Reset neural visualizer if it exists
    if (components.neuralVisualizer) {
      components.neuralVisualizer.updateVisualization();
    }
    
    // Reset quantum circuit if it exists
    if (components.quantumCircuit) {
      components.quantumCircuit.resetCircuit();
    }
    
    // Reset interface content
    const responseContent = document.getElementById('response-content');
    if (responseContent) {
      responseContent.innerHTML = '<p class="response-text">NeuroFusionOS reset complete. How may I assist you?</p>';
    }
    
    const reasoningPathContent = document.getElementById('reasoning-path-content');
    if (reasoningPathContent) {
      reasoningPathContent.innerHTML = '';
    }
    
    // Reset emotion display
    if (components.emotionEngine) {
      components.emotionEngine.resetEmotion();
    }
    
    // Show success notification
    showNotification('System reset complete', 'success');
  }
  
  /**
   * Show full system status information
   */
  function showFullStatus() {
    // Fetch current status
    fetch('/api/status')
      .then(response => response.json())
      .then(data => {
        // Create modal to display status
        const modal = document.createElement('div');
        modal.className = 'system-status-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';
        
        // Create content container
        const container = document.createElement('div');
        container.style.backgroundColor = 'var(--background-medium)';
        container.style.borderRadius = '8px';
        container.style.padding = '20px';
        container.style.width = '80%';
        container.style.maxWidth = '800px';
        container.style.maxHeight = '80%';
        container.style.overflow = 'auto';
        container.style.boxShadow = '0 0 20px rgba(58, 54, 224, 0.5)';
        
        // Create header
        const header = document.createElement('h2');
        header.textContent = 'NeuroFusionOS System Status';
        header.style.color = 'var(--secondary-color)';
        header.style.marginBottom = '15px';
        container.appendChild(header);
        
        // Format status data
        const statusHTML = `
          <div class="status-section">
            <h3>System Information</h3>
            <div class="status-grid">
              <div class="status-item">
                <span class="status-label">Status:</span>
                <span class="status-value">${data.status || 'Unknown'}</span>
              </div>
              <div class="status-item">
                <span class="status-label">Version:</span>
                <span class="status-value">${data.system_version || '0.0.0'}</span>
              </div>
              <div class="status-item">
                <span class="status-label">Uptime:</span>
                <span class="status-value">${formatTime(data.uptime || 0)}</span>
              </div>
            </div>
          </div>
          
          <div class="status-section">
            <h3>Quantum State</h3>
            <div class="status-grid">
              <div class="status-item">
                <span class="status-label">Initialized:</span>
                <span class="status-value">${data.quantum_state?.initialized ? 'Yes' : 'No'}</span>
              </div>
              <div class="status-item">
                <span class="status-label">Dimension:</span>
                <span class="status-value">${data.quantum_state?.dimension || 0}</span>
              </div>
            </div>
          </div>
          
          <div class="status-section">
            <h3>Memory Usage</h3>
            <div class="status-grid">
              <div class="status-item">
                <span class="status-label">Heap Used:</span>
                <span class="status-value">${formatBytes(data.memory_usage?.heapUsed || 0)}</span>
              </div>
              <div class="status-item">
                <span class="status-label">Heap Total:</span>
                <span class="status-value">${formatBytes(data.memory_usage?.heapTotal || 0)}</span>
              </div>
              <div class="status-item">
                <span class="status-label">External:</span>
                <span class="status-value">${formatBytes(data.memory_usage?.external || 0)}</span>
              </div>
              <div class="status-item">
                <span class="status-label">Memory Count:</span>
                <span class="status-value">${data.memory_count || 0} vectors</span>
              </div>
            </div>
          </div>
          
          <div class="status-section">
            <h3>Active Agents (${data.active_agents?.length || 0})</h3>
            <ul class="status-agent-list">
              ${(data.active_agents || []).map(agent => `<li>${agent}</li>`).join('')}
            </ul>
          </div>
        `;
        
        const statusContainer = document.createElement('div');
        statusContainer.innerHTML = statusHTML;
        
        // Style the status display
        const sections = statusContainer.querySelectorAll('.status-section');
        sections.forEach(section => {
          section.style.marginBottom = '20px';
        });
        
        const headings = statusContainer.querySelectorAll('h3');
        headings.forEach(heading => {
          heading.style.marginBottom = '10px';
          heading.style.color = 'var(--secondary-color)';
          heading.style.fontSize = '18px';
        });
        
        const grids = statusContainer.querySelectorAll('.status-grid');
        grids.forEach(grid => {
          grid.style.display = 'grid';
          grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
          grid.style.gap = '10px';
        });
        
        const items = statusContainer.querySelectorAll('.status-item');
        items.forEach(item => {
          item.style.display = 'flex';
          item.style.flexDirection = 'column';
          item.style.backgroundColor = 'var(--background-light)';
          item.style.padding = '10px';
          item.style.borderRadius = '4px';
        });
        
        const labels = statusContainer.querySelectorAll('.status-label');
        labels.forEach(label => {
          label.style.fontSize = '12px';
          label.style.color = 'var(--text-muted)';
          label.style.marginBottom = '5px';
        });
        
        const values = statusContainer.querySelectorAll('.status-value');
        values.forEach(value => {
          value.style.fontSize = '16px';
          value.style.fontWeight = 'bold';
        });
        
        const agentList = statusContainer.querySelector('.status-agent-list');
        if (agentList) {
          agentList.style.listStyleType = 'none';
          agentList.style.padding = '0';
          agentList.style.display = 'grid';
          agentList.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
          agentList.style.gap = '10px';
          
          const agentItems = agentList.querySelectorAll('li');
          agentItems.forEach(item => {
            item.style.backgroundColor = 'var(--background-light)';
            item.style.padding = '10px';
            item.style.borderRadius = '4px';
            item.style.display = 'flex';
            item.style.alignItems = 'center';
          });
        }
        
        container.appendChild(statusContainer);
        
        // Close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.backgroundColor = 'var(--primary-color)';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.padding = '8px 16px';
        closeButton.style.cursor = 'pointer';
        
        closeButton.addEventListener('click', () => {
          document.body.removeChild(modal);
        });
        
        container.appendChild(closeButton);
        modal.appendChild(container);
        
        // Add to document
        document.body.appendChild(modal);
        
        // Close when clicking outside
        modal.addEventListener('click', (event) => {
          if (event.target === modal) {
            document.body.removeChild(modal);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching system status:', error);
        showNotification('Error fetching system status', 'error');
      });
  }
  
  /**
   * Show help information
   */
  function showHelpModal() {
    // Create modal for help
    const modal = document.createElement('div');
    modal.className = 'help-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    
    // Create help container
    const container = document.createElement('div');
    container.style.backgroundColor = 'var(--background-medium)';
    container.style.borderRadius = '8px';
    container.style.padding = '20px';
    container.style.width = '80%';
    container.style.maxWidth = '800px';
    container.style.maxHeight = '80%';
    container.style.overflow = 'auto';
    container.style.boxShadow = '0 0 20px rgba(58, 54, 224, 0.5)';
    
    // Create header
    const header = document.createElement('h2');
    header.textContent = 'NeuroFusionOS Help';
    header.style.color = 'var(--secondary-color)';
    header.style.marginBottom = '15px';
    container.appendChild(header);
    
    // Help content
    const helpContent = document.createElement('div');
    helpContent.innerHTML = `
      <div class="help-section">
        <h3>System Commands</h3>
        <table class="command-table">
          <tr>
            <td><code>/help</code></td>
            <td>Show this help information</td>
          </tr>
          <tr>
            <td><code>/status</code></td>
            <td>Display detailed system status</td>
          </tr>
          <tr>
            <td><code>/reset</code></td>
            <td>Reset the system state</td>
          </tr>
        </table>
      </div>
      
      <div class="help-section">
        <h3>Quantum Circuit Controls</h3>
        <p>The quantum circuit simulator allows you to create and run simple quantum circuits.</p>
        <ul>
          <li><strong>Add H Gate</strong>: Add a Hadamard gate to create superposition</li>
          <li><strong>Add X Gate</strong>: Add a Pauli-X (NOT) gate to flip qubit state</li>
          <li><strong>Add CNOT Gate</strong>: Add a controlled-NOT gate to entangle qubits</li>
          <li><strong>Reset Circuit</strong>: Remove all gates from the circuit</li>
          <li><strong>Run Circuit</strong>: Simulate the quantum circuit and see results</li>
        </ul>
      </div>
      
      <div class="help-section">
        <h3>Neural Network Visualization</h3>
        <p>The 3D visualization shows a neural network with quantum enhancements.</p>
        <ul>
          <li><strong>Toggle Quantum Effects</strong>: Show/hide quantum effects in the visualization</li>
          <li><strong>Reset View</strong>: Reset the camera to the default position</li>
          <li><strong>Click on nodes</strong>: Toggle the quantum state of individual neurons</li>
        </ul>
      </div>
    `;
    
    // Style help content
    const sections = helpContent.querySelectorAll('.help-section');
    sections.forEach(section => {
      section.style.marginBottom = '20px';
    });
    
    const h3s = helpContent.querySelectorAll('h3');
    h3s.forEach(h3 => {
      h3.style.color = 'var(--secondary-color)';
      h3.style.marginBottom = '10px';
    });
    
    const commandTable = helpContent.querySelector('.command-table');
    if (commandTable) {
      commandTable.style.width = '100%';
      commandTable.style.borderCollapse = 'collapse';
      
      const rows = commandTable.querySelectorAll('tr');
      rows.forEach(row => {
        row.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
      });
      
      const cells = commandTable.querySelectorAll('td');
      cells.forEach(cell => {
        cell.style.padding = '10px';
      });
      
      const codes = commandTable.querySelectorAll('code');
      codes.forEach(code => {
        code.style.backgroundColor = 'var(--background-dark)';
        code.style.padding = '2px 6px';
        code.style.borderRadius = '4px';
        code.style.fontFamily = 'monospace';
      });
    }
    
    const lists = helpContent.querySelectorAll('ul');
    lists.forEach(list => {
      list.style.paddingLeft = '20px';
      list.style.marginTop = '10px';
    });
    
    const listItems = helpContent.querySelectorAll('li');
    listItems.forEach(item => {
      item.style.marginBottom = '5px';
    });
    
    container.appendChild(helpContent);
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.backgroundColor = 'var(--primary-color)';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.padding = '8px 16px';
    closeButton.style.cursor = 'pointer';
    
    closeButton.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    container.appendChild(closeButton);
    modal.appendChild(container);
    
    // Add to document
    document.body.appendChild(modal);
    
    // Close when clicking outside
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }
  
  /**
   * Show a notification toast
   * @param {string} message - Notification message
   * @param {string} type - Notification type (info, success, error)
   */
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '10px 15px';
    notification.style.borderRadius = '4px';
    notification.style.color = 'white';
    notification.style.fontWeight = 'bold';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'all 0.3s ease';
    notification.style.zIndex = '1001';
    
    // Set color based on type
    switch (type) {
      case 'success':
        notification.style.backgroundColor = 'var(--success-color)';
        break;
      case 'error':
        notification.style.backgroundColor = 'var(--error-color)';
        break;
      case 'info':
      default:
        notification.style.backgroundColor = 'var(--primary-color)';
        break;
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(20px)';
      
      // Remove from DOM after animation
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
  
  /**
   * Format bytes to human-readable string
   * @param {number} bytes - Bytes to format
   * @returns {string} Formatted string
   */
  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  /**
   * Format seconds to time string (HH:MM:SS)
   * @param {number} seconds - Seconds to format
   * @returns {string} Formatted time string
   */
  function formatTime(seconds) {
    seconds = Math.floor(seconds);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  }
});