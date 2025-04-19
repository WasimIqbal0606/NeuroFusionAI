/**
 * NeuroFusionOS Quantum Circuit Visualizer
 * Visualizes and interacts with quantum circuits
 */

class QuantumCircuit {
  constructor() {
    // Circuit data
    this.qubitCount = 3;
    this.gates = [];
    this.maxGates = 10;
    
    // Circuit display elements
    this.circuitDisplay = document.getElementById('circuit-display');
    
    // Circuit controls
    this.qubitCountInput = document.getElementById('qubit-count');
    this.addHGateButton = document.getElementById('add-h-gate');
    this.addXGateButton = document.getElementById('add-x-gate');
    this.addCNOTGateButton = document.getElementById('add-cnot-gate');
    this.resetCircuitButton = document.getElementById('reset-circuit');
    this.runCircuitButton = document.getElementById('run-circuit');
    
    // Initialize
    this.init();
  }
  
  /**
   * Initialize the quantum circuit interface
   */
  init() {
    // Set initial qubit count
    this.qubitCountInput.value = this.qubitCount;
    
    // Add event listeners
    this.qubitCountInput.addEventListener('change', () => {
      this.setQubitCount(parseInt(this.qubitCountInput.value));
    });
    
    this.addHGateButton.addEventListener('click', () => {
      this.showGateDialog('H');
    });
    
    this.addXGateButton.addEventListener('click', () => {
      this.showGateDialog('X');
    });
    
    this.addCNOTGateButton.addEventListener('click', () => {
      this.showCNOTDialog();
    });
    
    this.resetCircuitButton.addEventListener('click', () => {
      this.resetCircuit();
    });
    
    this.runCircuitButton.addEventListener('click', () => {
      this.runCircuit();
    });
    
    // Render initial circuit
    this.renderCircuit();
  }
  
  /**
   * Set the number of qubits in the circuit
   * @param {number} count - Number of qubits
   */
  setQubitCount(count) {
    // Validate qubit count
    if (isNaN(count) || count < 1) {
      count = 1;
    } else if (count > 8) {
      count = 8;
    }
    
    this.qubitCount = count;
    this.qubitCountInput.value = count;
    
    // Clear gates that are now invalid
    this.gates = this.gates.filter(gate => {
      if (gate.type === 'H' || gate.type === 'X') {
        return gate.qubit < this.qubitCount;
      } else if (gate.type === 'CNOT') {
        return gate.control < this.qubitCount && gate.target < this.qubitCount;
      }
      return true;
    });
    
    // Re-render the circuit
    this.renderCircuit();
  }
  
  /**
   * Show dialog to add a single-qubit gate
   * @param {string} gateType - Gate type ('H' or 'X')
   */
  showGateDialog(gateType) {
    // Create a simple dialog to select qubit
    const qubit = prompt(`Select qubit for ${gateType} gate (0-${this.qubitCount - 1}):`, '0');
    const qubitIndex = parseInt(qubit);
    
    if (!isNaN(qubitIndex) && qubitIndex >= 0 && qubitIndex < this.qubitCount) {
      this.addGate({
        type: gateType,
        qubit: qubitIndex
      });
    } else {
      alert('Invalid qubit index. Please enter a number between 0 and ' + (this.qubitCount - 1));
    }
  }
  
  /**
   * Show dialog to add a CNOT gate
   */
  showCNOTDialog() {
    // Create a simple dialog to select control and target qubits
    const control = prompt(`Select control qubit for CNOT gate (0-${this.qubitCount - 1}):`, '0');
    const controlIndex = parseInt(control);
    
    if (isNaN(controlIndex) || controlIndex < 0 || controlIndex >= this.qubitCount) {
      alert('Invalid control qubit index. Please enter a number between 0 and ' + (this.qubitCount - 1));
      return;
    }
    
    const target = prompt(`Select target qubit for CNOT gate (0-${this.qubitCount - 1}, different from control):`, '1');
    const targetIndex = parseInt(target);
    
    if (isNaN(targetIndex) || targetIndex < 0 || targetIndex >= this.qubitCount) {
      alert('Invalid target qubit index. Please enter a number between 0 and ' + (this.qubitCount - 1));
      return;
    }
    
    if (controlIndex === targetIndex) {
      alert('Control and target qubits must be different');
      return;
    }
    
    this.addGate({
      type: 'CNOT',
      control: controlIndex,
      target: targetIndex
    });
  }
  
  /**
   * Add a gate to the circuit
   * @param {Object} gate - Gate definition
   */
  addGate(gate) {
    // Check if we've reached the maximum number of gates
    if (this.gates.length >= this.maxGates) {
      alert(`Maximum circuit depth (${this.maxGates} gates) reached. Remove some gates first.`);
      return;
    }
    
    this.gates.push(gate);
    this.renderCircuit();
  }
  
  /**
   * Remove a gate from the circuit
   * @param {number} index - Index of gate to remove
   */
  removeGate(index) {
    if (index >= 0 && index < this.gates.length) {
      this.gates.splice(index, 1);
      this.renderCircuit();
    }
  }
  
  /**
   * Reset the circuit, removing all gates
   */
  resetCircuit() {
    this.gates = [];
    this.renderCircuit();
  }
  
  /**
   * Render the quantum circuit visualization
   */
  renderCircuit() {
    // Clear current display
    this.circuitDisplay.innerHTML = '';
    
    // Create SVG for the circuit
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    
    // Calculate dimensions
    const wireSpacing = 40;
    const gateSpacing = 60;
    const width = Math.max(300, (this.gates.length + 1) * gateSpacing);
    const height = (this.qubitCount * wireSpacing) + 20;
    
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    
    // Draw qubit wires
    for (let i = 0; i < this.qubitCount; i++) {
      const y = 20 + (i * wireSpacing);
      
      // Wire line
      const wire = document.createElementNS(svgNS, 'line');
      wire.setAttribute('x1', 10);
      wire.setAttribute('y1', y);
      wire.setAttribute('x2', width - 10);
      wire.setAttribute('y2', y);
      wire.setAttribute('stroke', 'rgba(255, 255, 255, 0.5)');
      wire.setAttribute('stroke-width', 2);
      svg.appendChild(wire);
      
      // Qubit label
      const label = document.createElementNS(svgNS, 'text');
      label.setAttribute('x', 20);
      label.setAttribute('y', y + 5);
      label.setAttribute('fill', 'white');
      label.setAttribute('font-family', 'monospace');
      label.setAttribute('font-size', '14px');
      label.textContent = `|q${i}⟩`;
      svg.appendChild(label);
    }
    
    // Draw gates
    this.gates.forEach((gate, gateIndex) => {
      const x = 80 + (gateIndex * gateSpacing);
      
      if (gate.type === 'H' || gate.type === 'X') {
        const y = 20 + (gate.qubit * wireSpacing);
        
        // Gate box
        const rect = document.createElementNS(svgNS, 'rect');
        rect.setAttribute('x', x - 15);
        rect.setAttribute('y', y - 15);
        rect.setAttribute('width', 30);
        rect.setAttribute('height', 30);
        rect.setAttribute('fill', gate.type === 'H' ? '#3a36e0' : '#e03636');
        rect.setAttribute('stroke', 'white');
        rect.setAttribute('stroke-width', 1);
        rect.setAttribute('rx', 5);
        svg.appendChild(rect);
        
        // Gate label
        const text = document.createElementNS(svgNS, 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y + 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-family', 'monospace');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('font-size', '14px');
        text.textContent = gate.type;
        svg.appendChild(text);
        
        // Remove button
        const removeCircle = document.createElementNS(svgNS, 'circle');
        removeCircle.setAttribute('cx', x + 15);
        removeCircle.setAttribute('cy', y - 15);
        removeCircle.setAttribute('r', 8);
        removeCircle.setAttribute('fill', '#ff3b30');
        removeCircle.setAttribute('stroke', 'white');
        removeCircle.setAttribute('stroke-width', 1);
        removeCircle.setAttribute('class', 'remove-gate');
        removeCircle.setAttribute('data-index', gateIndex);
        removeCircle.setAttribute('style', 'cursor: pointer');
        svg.appendChild(removeCircle);
        
        const removeCross = document.createElementNS(svgNS, 'text');
        removeCross.setAttribute('x', x + 15);
        removeCross.setAttribute('y', y - 11);
        removeCross.setAttribute('text-anchor', 'middle');
        removeCross.setAttribute('fill', 'white');
        removeCross.setAttribute('font-family', 'sans-serif');
        removeCross.setAttribute('font-size', '12px');
        removeCross.setAttribute('style', 'pointer-events: none');
        removeCross.textContent = '×';
        svg.appendChild(removeCross);
      } else if (gate.type === 'CNOT') {
        const controlY = 20 + (gate.control * wireSpacing);
        const targetY = 20 + (gate.target * wireSpacing);
        
        // Connect line
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', x);
        line.setAttribute('y1', controlY);
        line.setAttribute('x2', x);
        line.setAttribute('y2', targetY);
        line.setAttribute('stroke', 'white');
        line.setAttribute('stroke-width', 2);
        svg.appendChild(line);
        
        // Control dot
        const controlDot = document.createElementNS(svgNS, 'circle');
        controlDot.setAttribute('cx', x);
        controlDot.setAttribute('cy', controlY);
        controlDot.setAttribute('r', 5);
        controlDot.setAttribute('fill', 'white');
        svg.appendChild(controlDot);
        
        // Target circle
        const targetCircle = document.createElementNS(svgNS, 'circle');
        targetCircle.setAttribute('cx', x);
        targetCircle.setAttribute('cy', targetY);
        targetCircle.setAttribute('r', 15);
        targetCircle.setAttribute('fill', 'none');
        targetCircle.setAttribute('stroke', 'white');
        targetCircle.setAttribute('stroke-width', 2);
        svg.appendChild(targetCircle);
        
        // Target X
        const targetX1 = document.createElementNS(svgNS, 'line');
        targetX1.setAttribute('x1', x - 10);
        targetX1.setAttribute('y1', targetY - 10);
        targetX1.setAttribute('x2', x + 10);
        targetX1.setAttribute('y2', targetY + 10);
        targetX1.setAttribute('stroke', 'white');
        targetX1.setAttribute('stroke-width', 2);
        svg.appendChild(targetX1);
        
        const targetX2 = document.createElementNS(svgNS, 'line');
        targetX2.setAttribute('x1', x - 10);
        targetX2.setAttribute('y1', targetY + 10);
        targetX2.setAttribute('x2', x + 10);
        targetX2.setAttribute('y2', targetY - 10);
        targetX2.setAttribute('stroke', 'white');
        targetX2.setAttribute('stroke-width', 2);
        svg.appendChild(targetX2);
        
        // Remove button
        const removeCircle = document.createElementNS(svgNS, 'circle');
        removeCircle.setAttribute('cx', x + 20);
        removeCircle.setAttribute('cy', Math.min(controlY, targetY) - 10);
        removeCircle.setAttribute('r', 8);
        removeCircle.setAttribute('fill', '#ff3b30');
        removeCircle.setAttribute('stroke', 'white');
        removeCircle.setAttribute('stroke-width', 1);
        removeCircle.setAttribute('class', 'remove-gate');
        removeCircle.setAttribute('data-index', gateIndex);
        removeCircle.setAttribute('style', 'cursor: pointer');
        svg.appendChild(removeCircle);
        
        const removeCross = document.createElementNS(svgNS, 'text');
        removeCross.setAttribute('x', x + 20);
        removeCross.setAttribute('y', Math.min(controlY, targetY) - 6);
        removeCross.setAttribute('text-anchor', 'middle');
        removeCross.setAttribute('fill', 'white');
        removeCross.setAttribute('font-family', 'sans-serif');
        removeCross.setAttribute('font-size', '12px');
        removeCross.setAttribute('style', 'pointer-events: none');
        removeCross.textContent = '×';
        svg.appendChild(removeCross);
      }
    });
    
    // Add the SVG to the display
    this.circuitDisplay.appendChild(svg);
    
    // Add event listeners for gate removal buttons
    const removeButtons = this.circuitDisplay.querySelectorAll('.remove-gate');
    removeButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const index = parseInt(event.target.getAttribute('data-index'));
        this.removeGate(index);
      });
    });
  }
  
  /**
   * Run the circuit simulation
   */
  runCircuit() {
    // Create request data
    const requestData = {
      numQubits: this.qubitCount,
      gates: this.gates
    };
    
    // Show loading state
    this.runCircuitButton.textContent = 'Running...';
    this.runCircuitButton.disabled = true;
    
    // Call the API
    fetch('/api/quantum/circuit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
      // Reset button state
      this.runCircuitButton.textContent = 'Run Circuit';
      this.runCircuitButton.disabled = false;
      
      // Display results
      this.displayCircuitResults(data);
    })
    .catch(error => {
      console.error('Error running quantum circuit:', error);
      
      // Reset button state
      this.runCircuitButton.textContent = 'Run Circuit';
      this.runCircuitButton.disabled = false;
      
      // Show error message
      alert('Error running quantum circuit: ' + error.message);
    });
  }
  
  /**
   * Display the results of the circuit simulation
   * @param {Object} results - Circuit simulation results
   */
  displayCircuitResults(results) {
    // Create modal dialog for results
    const modal = document.createElement('div');
    modal.className = 'quantum-results-modal';
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
    
    // Create results container
    const container = document.createElement('div');
    container.style.backgroundColor = 'var(--background-medium)';
    container.style.borderRadius = '8px';
    container.style.padding = '20px';
    container.style.width = '80%';
    container.style.maxWidth = '600px';
    container.style.maxHeight = '80%';
    container.style.overflow = 'auto';
    container.style.boxShadow = '0 0 20px rgba(58, 54, 224, 0.5)';
    
    // Create header
    const header = document.createElement('h2');
    header.textContent = 'Quantum Circuit Results';
    header.style.color = 'var(--secondary-color)';
    header.style.marginBottom = '15px';
    container.appendChild(header);
    
    // Most likely outcome
    if (results.most_likely) {
      const mostLikely = document.createElement('div');
      mostLikely.innerHTML = `<h3>Most Likely Outcome</h3>
                              <div class="result-box">
                                <span class="result-state">${results.most_likely.state}</span>
                                <span class="result-prob">${(results.most_likely.probability * 100).toFixed(1)}%</span>
                              </div>`;
      mostLikely.style.marginBottom = '20px';
      container.appendChild(mostLikely);
    }
    
    // Create results list
    const resultsList = document.createElement('div');
    resultsList.innerHTML = '<h3>All Outcomes</h3>';
    
    // Sort states by probability
    const states = results.states || [];
    states.sort((a, b) => b.probability - a.probability);
    
    // Create bar chart for states
    const chartContainer = document.createElement('div');
    chartContainer.style.height = '200px';
    chartContainer.style.marginBottom = '20px';
    chartContainer.style.display = 'flex';
    chartContainer.style.alignItems = 'flex-end';
    chartContainer.style.justifyContent = 'space-between';
    chartContainer.style.padding = '10px 0';
    chartContainer.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
    
    states.forEach(state => {
      const bar = document.createElement('div');
      bar.style.flex = '1';
      bar.style.margin = '0 2px';
      bar.style.height = `${state.probability * 100}%`;
      bar.style.backgroundColor = 'var(--primary-color)';
      bar.style.borderRadius = '4px 4px 0 0';
      bar.style.position = 'relative';
      
      const tooltip = document.createElement('div');
      tooltip.textContent = `|${state.state}⟩: ${(state.probability * 100).toFixed(1)}%`;
      tooltip.style.position = 'absolute';
      tooltip.style.bottom = '100%';
      tooltip.style.left = '50%';
      tooltip.style.transform = 'translateX(-50%)';
      tooltip.style.backgroundColor = 'var(--background-dark)';
      tooltip.style.padding = '4px 8px';
      tooltip.style.borderRadius = '4px';
      tooltip.style.fontSize = '12px';
      tooltip.style.whiteSpace = 'nowrap';
      tooltip.style.display = 'none';
      
      bar.appendChild(tooltip);
      
      bar.addEventListener('mouseenter', () => {
        tooltip.style.display = 'block';
      });
      
      bar.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
      
      chartContainer.appendChild(bar);
    });
    
    resultsList.appendChild(chartContainer);
    
    // List all states with probabilities
    const statesList = document.createElement('div');
    statesList.style.marginTop = '10px';
    
    states.forEach(state => {
      const stateItem = document.createElement('div');
      stateItem.innerHTML = `<div class="state-item">
                              <span class="state-label">|${state.state}⟩</span>
                              <div class="state-bar">
                                <div class="state-fill" style="width: ${state.probability * 100}%"></div>
                              </div>
                              <span class="state-value">${(state.probability * 100).toFixed(1)}%</span>
                            </div>`;
      stateItem.style.display = 'flex';
      stateItem.style.alignItems = 'center';
      stateItem.style.marginBottom = '8px';
      
      const stateLabel = stateItem.querySelector('.state-label');
      stateLabel.style.flex = '0 0 80px';
      stateLabel.style.fontFamily = 'monospace';
      
      const stateBar = stateItem.querySelector('.state-bar');
      stateBar.style.flex = '1';
      stateBar.style.height = '8px';
      stateBar.style.backgroundColor = 'var(--background-dark)';
      stateBar.style.borderRadius = '4px';
      stateBar.style.overflow = 'hidden';
      stateBar.style.margin = '0 10px';
      
      const stateFill = stateItem.querySelector('.state-fill');
      stateFill.style.height = '100%';
      stateFill.style.backgroundColor = 'var(--primary-color)';
      stateFill.style.borderRadius = '4px';
      
      const stateValue = stateItem.querySelector('.state-value');
      stateValue.style.flex = '0 0 60px';
      stateValue.style.textAlign = 'right';
      
      statesList.appendChild(stateItem);
    });
    
    resultsList.appendChild(statesList);
    container.appendChild(resultsList);
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.backgroundColor = 'var(--primary-color)';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.padding = '8px 16px';
    closeButton.style.marginTop = '20px';
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
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.quantumCircuit = new QuantumCircuit();
});