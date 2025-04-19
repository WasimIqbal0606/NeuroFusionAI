/**
 * NeuroFusionOS Neural Network Visualizer
 * Implements a 3D visualization of the quantum neural network using Three.js
 */

class NeuralVisualizer {
  constructor(containerId) {
    // DOM container
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container element with id '${containerId}' not found.`);
      return;
    }
    
    // Visualization state
    this.isInitialized = false;
    this.isRunning = false;
    this.showQuantumEffects = true;
    this.nodeData = [];
    this.linkData = [];
    this.nodes = []; // Three.js objects
    this.links = []; // Three.js objects
    this.neuronCount = {
      input: 8,
      hidden: [12, 10],
      output: 6
    };
    
    // Three.js components
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    // Materials and colors
    this.materials = {
      node: {
        input: new THREE.MeshPhongMaterial({ 
          color: 0x3a36e0,
          emissive: 0x3a36e0,
          emissiveIntensity: 0.3,
          shininess: 30
        }),
        hidden: new THREE.MeshPhongMaterial({ 
          color: 0x0db8de,
          emissive: 0x0db8de,
          emissiveIntensity: 0.3,
          shininess: 30
        }),
        output: new THREE.MeshPhongMaterial({ 
          color: 0x4cd964,
          emissive: 0x4cd964,
          emissiveIntensity: 0.3,
          shininess: 30
        }),
      },
      link: new THREE.LineBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.2
      }),
      quantum: new THREE.MeshPhongMaterial({ 
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7,
        shininess: 100
      })
    };
    
    // Animation properties
    this.clock = new THREE.Clock();
    this.animationFrameId = null;
    
    // Tooltip
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'tooltip';
    document.body.appendChild(this.tooltip);
    
    // Initialize the visualization
    this.init();
    
    // Add event listeners
    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.container.addEventListener('click', this.onMouseClick.bind(this));
    
    // Listen for control events
    document.getElementById('toggle-quantum-effects').addEventListener('click', () => {
      this.toggleQuantumEffects();
    });
    
    document.getElementById('reset-visualization').addEventListener('click', () => {
      this.resetCamera();
    });
  }
  
  /**
   * Initialize the Three.js scene and components
   */
  init() {
    // Check if already initialized
    if (this.isInitialized) return;
    
    // Get container dimensions
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0c0c1d);
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 70);
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);
    
    // Add orbit controls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    
    // Add lights
    this.addLights();
    
    // Generate network data
    this.generateNetworkData();
    
    // Create the neural network visualization
    this.createNeuralNetwork();
    
    // Add quantum effects
    this.addQuantumEffects();
    
    // Start animation loop
    this.isInitialized = true;
    this.animate();
    
    console.log('Neural visualizer initialized');
  }
  
  /**
   * Add lights to the scene
   */
  addLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);
    
    // Main directional light
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(1, 1, 1);
    this.scene.add(mainLight);
    
    // Secondary lights for dramatic effect
    const blueLight = new THREE.PointLight(0x3a36e0, 2, 50);
    blueLight.position.set(-10, 15, 15);
    this.scene.add(blueLight);
    
    const cyanLight = new THREE.PointLight(0x0db8de, 2, 50);
    cyanLight.position.set(10, -5, 10);
    this.scene.add(cyanLight);
  }
  
  /**
   * Generate node and link data for neural network
   */
  generateNetworkData() {
    this.nodeData = [];
    this.linkData = [];
    
    // Calculate layer positions
    const layerCount = 2 + this.neuronCount.hidden.length;
    const layerSpacing = 20;
    const xOffset = -layerSpacing * (layerCount - 1) / 2;
    
    // Helper to calculate vertical spacing
    const getYPositions = (count) => {
      const spacing = Math.min(5, 30 / count);
      const offset = (spacing * (count - 1)) / 2;
      return Array(count).fill().map((_, i) => i * spacing - offset);
    };
    
    // Add input layer nodes
    const inputYPositions = getYPositions(this.neuronCount.input);
    const inputNodes = inputYPositions.map((y, i) => ({
      id: `input-${i}`,
      x: xOffset,
      y: y,
      z: 0,
      layer: 'input',
      layerIndex: 0,
      nodeIndex: i,
      activation: Math.random(),
      size: 0.8,
      quantum: false
    }));
    this.nodeData.push(...inputNodes);
    
    // Add hidden layer nodes
    let prevLayerNodes = inputNodes;
    let currentLayerIndex = 1;
    
    this.neuronCount.hidden.forEach((hiddenCount, hiddenLayerIndex) => {
      const hiddenYPositions = getYPositions(hiddenCount);
      const hiddenNodes = hiddenYPositions.map((y, i) => ({
        id: `hidden-${hiddenLayerIndex}-${i}`,
        x: xOffset + currentLayerIndex * layerSpacing,
        y: y,
        z: 0,
        layer: 'hidden',
        layerIndex: currentLayerIndex,
        nodeIndex: i,
        activation: Math.random(),
        size: 0.8,
        quantum: Math.random() < 0.3 // Some nodes have quantum properties
      }));
      
      // Connect to previous layer
      prevLayerNodes.forEach(source => {
        hiddenNodes.forEach(target => {
          if (Math.random() < 0.7) { // 70% connectivity for sparser look
            this.linkData.push({
              source: source.id,
              target: target.id,
              value: Math.random() * 2 - 1, // -1 to 1
              quantum: source.quantum || target.quantum
            });
          }
        });
      });
      
      this.nodeData.push(...hiddenNodes);
      prevLayerNodes = hiddenNodes;
      currentLayerIndex++;
    });
    
    // Add output layer nodes
    const outputYPositions = getYPositions(this.neuronCount.output);
    const outputNodes = outputYPositions.map((y, i) => ({
      id: `output-${i}`,
      x: xOffset + (layerCount - 1) * layerSpacing,
      y: y,
      z: 0,
      layer: 'output',
      layerIndex: currentLayerIndex,
      nodeIndex: i,
      activation: Math.random(),
      size: 0.8,
      quantum: Math.random() < 0.2
    }));
    
    // Connect to last hidden layer
    prevLayerNodes.forEach(source => {
      outputNodes.forEach(target => {
        this.linkData.push({
          source: source.id,
          target: target.id,
          value: Math.random() * 2 - 1,
          quantum: source.quantum || target.quantum
        });
      });
    });
    
    this.nodeData.push(...outputNodes);
  }
  
  /**
   * Create 3D visualization of the neural network
   */
  createNeuralNetwork() {
    // Clear any existing network
    this.nodes.forEach(node => this.scene.remove(node));
    this.links.forEach(link => this.scene.remove(link));
    this.nodes = [];
    this.links = [];
    
    // Create nodes (neurons)
    const geometry = new THREE.SphereGeometry(1, 16, 16);
    
    this.nodeData.forEach(node => {
      let material;
      switch (node.layer) {
        case 'input':
          material = this.materials.node.input;
          break;
        case 'hidden':
          material = this.materials.node.hidden;
          break;
        case 'output':
          material = this.materials.node.output;
          break;
        default:
          material = this.materials.node.hidden;
      }
      
      const mesh = new THREE.Mesh(geometry, material.clone());
      mesh.position.set(node.x, node.y, node.z);
      mesh.scale.setScalar(node.size);
      mesh.userData = {
        id: node.id,
        type: 'node',
        data: node
      };
      
      this.scene.add(mesh);
      this.nodes.push(mesh);
    });
    
    // Create links (synapses)
    this.linkData.forEach(link => {
      const sourceNode = this.nodeData.find(n => n.id === link.source);
      const targetNode = this.nodeData.find(n => n.id === link.target);
      
      if (sourceNode && targetNode) {
        const points = [
          new THREE.Vector3(sourceNode.x, sourceNode.y, sourceNode.z),
          new THREE.Vector3(targetNode.x, targetNode.y, targetNode.z)
        ];
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = this.materials.link.clone();
        
        // Adjust opacity based on connection strength
        lineMaterial.opacity = Math.abs(link.value) * 0.5;
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        line.userData = {
          id: `${link.source}-${link.target}`,
          type: 'link',
          data: link
        };
        
        this.scene.add(line);
        this.links.push(line);
      }
    });
  }
  
  /**
   * Add quantum effects to quantum nodes
   */
  addQuantumEffects() {
    // Add quantum particle effects to quantum nodes
    this.nodeData.forEach(node => {
      if (node.quantum && this.showQuantumEffects) {
        // Find the corresponding 3D node
        const nodeObj = this.nodes.find(n => n.userData.id === node.id);
        if (nodeObj) {
          // Create quantum effect
          const quantumGeometry = new THREE.SphereGeometry(1.5, 8, 8);
          const quantumMesh = new THREE.Mesh(quantumGeometry, this.materials.quantum.clone());
          quantumMesh.position.copy(nodeObj.position);
          quantumMesh.scale.setScalar(node.size * 1.5);
          quantumMesh.userData = {
            type: 'quantum-effect',
            parentId: node.id,
            phase: Math.random() * Math.PI * 2
          };
          
          this.scene.add(quantumMesh);
          this.nodes.push(quantumMesh);
          
          // Add orbital electrons effect
          this.addQuantumOrbitals(nodeObj, 3);
        }
      }
    });
  }
  
  /**
   * Add quantum orbital particles around a node
   * @param {THREE.Mesh} nodeObj - The node object to add orbitals to
   * @param {number} count - Number of orbital particles
   */
  addQuantumOrbitals(nodeObj, count) {
    const orbitGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const orbitMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.5
    });
    
    for (let i = 0; i < count; i++) {
      const orbitMesh = new THREE.Mesh(orbitGeometry, orbitMaterial);
      
      // Set initial random position on a sphere
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const radius = 1.5 + Math.random() * 0.5;
      
      orbitMesh.position.set(
        nodeObj.position.x + radius * Math.sin(theta) * Math.cos(phi),
        nodeObj.position.y + radius * Math.sin(theta) * Math.sin(phi),
        nodeObj.position.z + radius * Math.cos(theta)
      );
      
      orbitMesh.userData = {
        type: 'quantum-orbital',
        parentId: nodeObj.userData.id,
        orbitSpeed: (0.5 + Math.random() * 0.5) * (Math.random() < 0.5 ? 1 : -1),
        orbitRadius: radius,
        orbitPhase: Math.random() * Math.PI * 2,
        orbitAxis: new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize()
      };
      
      this.scene.add(orbitMesh);
      this.nodes.push(orbitMesh);
    }
  }
  
  /**
   * Animation loop
   */
  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    
    const delta = this.clock.getDelta();
    
    // Update controls
    this.controls.update();
    
    // Update quantum effects
    this.updateQuantumEffects(delta);
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
  
  /**
   * Update quantum visual effects
   * @param {number} delta - Time delta
   */
  updateQuantumEffects(delta) {
    if (!this.showQuantumEffects) return;
    
    this.nodes.forEach(node => {
      if (node.userData.type === 'quantum-effect') {
        // Pulsating effect
        node.userData.phase += delta * 1.5;
        const scale = 1.0 + 0.2 * Math.sin(node.userData.phase);
        node.scale.setScalar(scale);
        
        // Opacity pulsation
        node.material.opacity = 0.4 + 0.2 * Math.sin(node.userData.phase);
      }
      
      if (node.userData.type === 'quantum-orbital') {
        // Get parent node
        const parentNode = this.nodes.find(n => n.userData.id === node.userData.parentId);
        
        if (parentNode) {
          // Calculate new position around parent
          node.userData.orbitPhase += delta * node.userData.orbitSpeed;
          
          // Create rotation axis
          const axis = node.userData.orbitAxis;
          
          // Calculate new position using quaternion rotation
          const radius = node.userData.orbitRadius;
          const baseVector = new THREE.Vector3(radius, 0, 0);
          const rotation = new THREE.Quaternion();
          rotation.setFromAxisAngle(axis, node.userData.orbitPhase);
          
          baseVector.applyQuaternion(rotation);
          node.position.copy(parentNode.position).add(baseVector);
        }
      }
    });
    
    // Update quantum links
    this.links.forEach(link => {
      if (link.userData.data.quantum && this.showQuantumEffects) {
        // Pulsating opacity
        const time = this.clock.elapsedTime;
        link.material.opacity = 0.2 + 0.3 * Math.abs(Math.sin(time * 2 + link.userData.id.charCodeAt(0) / 10));
      }
    });
  }
  
  /**
   * Window resize handler
   */
  onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  
  /**
   * Handle mouse movement for node hovering
   * @param {MouseEvent} event - Mouse move event
   */
  onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / this.container.clientHeight) * 2 + 1;
    
    // Update the raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Check for intersections with nodes
    const intersects = this.raycaster.intersectObjects(this.nodes);
    
    // Show tooltip for the first intersected node
    if (intersects.length > 0) {
      const object = intersects[0].object;
      const userData = object.userData;
      
      // Only show tooltip for actual nodes, not quantum effects
      if (userData.type === 'node') {
        const nodeData = userData.data;
        
        // Set tooltip position
        this.tooltip.style.left = (event.clientX + 15) + 'px';
        this.tooltip.style.top = (event.clientY + 15) + 'px';
        
        // Set tooltip content
        let content = `${nodeData.layer.charAt(0).toUpperCase() + nodeData.layer.slice(1)} Neuron ${nodeData.nodeIndex}<br>`;
        content += `Activation: ${(nodeData.activation * 100).toFixed(1)}%<br>`;
        if (nodeData.quantum) {
          content += '<span style="color: #0db8de">Quantum Enhanced</span>';
        }
        
        this.tooltip.innerHTML = content;
        this.tooltip.classList.add('visible');
        
        // Highlight the node
        object.scale.setScalar(nodeData.size * 1.3);
      }
    } else {
      // Hide tooltip when not hovering over a node
      this.tooltip.classList.remove('visible');
      
      // Reset all node sizes
      this.nodes.forEach(node => {
        if (node.userData.type === 'node') {
          node.scale.setScalar(node.userData.data.size);
        }
      });
    }
  }
  
  /**
   * Handle mouse click on nodes
   * @param {MouseEvent} event - Mouse click event
   */
  onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / this.container.clientHeight) * 2 + 1;
    
    // Update the raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Check for intersections with nodes
    const intersects = this.raycaster.intersectObjects(this.nodes);
    
    // Process click on node
    if (intersects.length > 0) {
      const object = intersects[0].object;
      const userData = object.userData;
      
      if (userData.type === 'node') {
        const nodeData = userData.data;
        console.log('Clicked node:', nodeData);
        
        // Toggle quantum state of the node
        nodeData.quantum = !nodeData.quantum;
        
        // Update visualization
        this.updateVisualization();
      }
    }
  }
  
  /**
   * Toggle quantum effects
   */
  toggleQuantumEffects() {
    this.showQuantumEffects = !this.showQuantumEffects;
    this.updateVisualization();
    
    // Update button text
    const toggleButton = document.getElementById('toggle-quantum-effects');
    if (toggleButton) {
      toggleButton.textContent = this.showQuantumEffects 
        ? 'Hide Quantum Effects' 
        : 'Show Quantum Effects';
    }
  }
  
  /**
   * Reset camera to initial position
   */
  resetCamera() {
    this.camera.position.set(0, 0, 70);
    this.camera.lookAt(0, 0, 0);
    this.controls.reset();
  }
  
  /**
   * Update the neural network visualization
   */
  updateVisualization() {
    // Clear previous visualization
    this.scene.remove(...this.nodes);
    this.scene.remove(...this.links);
    this.nodes = [];
    this.links = [];
    
    // Recreate the visualization
    this.createNeuralNetwork();
    
    if (this.showQuantumEffects) {
      this.addQuantumEffects();
    }
  }
  
  /**
   * Clean up resources
   */
  dispose() {
    // Stop animation
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    // Remove event listeners
    window.removeEventListener('resize', this.onWindowResize);
    this.container.removeEventListener('mousemove', this.onMouseMove);
    this.container.removeEventListener('click', this.onMouseClick);
    
    // Remove tooltip
    if (this.tooltip && this.tooltip.parentNode) {
      this.tooltip.parentNode.removeChild(this.tooltip);
    }
    
    // Dispose of Three.js resources
    this.scene.remove(...this.scene.children);
    this.renderer.dispose();
    
    // Remove renderer from DOM
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}

// Initialize the visualizer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.neuralVisualizer = new NeuralVisualizer('visualization-canvas');
});