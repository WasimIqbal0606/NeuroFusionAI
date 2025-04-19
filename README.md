# NeuroFusionOS: Quantum-Neural Hybrid AGI System

![NeuroFusionOS](./public/assets/neurofusion-logo.png)

NeuroFusionOS is a cutting-edge Artificial General Intelligence (AGI) system that combines quantum computing principles with advanced neural networks to create a powerful hybrid reasoning system. The system features intelligent visualization and an innovative memory architecture designed to enhance reasoning capabilities beyond traditional AI systems.

## Key Features

- **Quantum-Neural Hybrid Architecture**: Combines classical neural networks with quantum computing principles
- **Advanced 3D Visualization**: Real-time visualization of neural networks, quantum states, and memory vectors
- **Multi-Agent System**: Orchestrated agents that work together for different specialized tasks
- **Vector-Based Memory**: Efficient storage and retrieval of memories in a high-dimensional vector space
- **Quantum-Enhanced Reasoning**: Leverages quantum superposition and entanglement principles to explore multiple reasoning paths simultaneously

## Getting Started

### Prerequisites

- Node.js 16+ 
- Modern web browser with WebGL support

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/neurofusion-os.git
   cd neurofusion-os
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

4. Access the system:
   - Standard interface: http://localhost:3000/
   - Advanced 3D interface: http://localhost:3000/advanced-interface.html
   - Testing interface: http://localhost:3000/test.html

## Using the Interface

### Standard Interface

The standard interface provides a clean, functional way to interact with NeuroFusionOS:

1. **Dashboard**: Displays system statistics, active agents, and memory usage
2. **Neural Visualization**: Shows a 3D representation of the system's neural network
3. **Command Interface**: Enter queries or commands in the input field at the bottom
4. **Response Area**: View system responses and reasoning processes

### Advanced Interface

The advanced interface offers a more immersive, visually striking experience:

1. **3D Visualization Modes**:
   - **Neural View**: Displays the neural network with animated neurons and connections
   - **Quantum View**: Shows quantum circuit representation with gates and qubits
   - **Memory Map**: Visualizes memory vectors in a 3D space

2. **Interaction Controls**:
   - Use mouse to rotate the 3D visualization
   - Scroll to zoom in/out
   - Click and drag to pan
   - Use the control panel in the top-right to switch visualization modes

3. **System Status Panels**:
   - Left panel: System statistics and agent management
   - Right panel: Quantum state information and recent memories
   - Bottom panel: Command interface for queries

### Making Queries

To interact with NeuroFusionOS:

1. Type your query in the command input field at the bottom of the interface
2. Click the "Process" button or press Enter
3. The system will process your query using quantum-enhanced reasoning
4. Observe the visual effects as the system activates various neural pathways
5. Review the response, which includes:
   - Main result text
   - Confidence score
   - Processing time
   - Quantum effects that influenced the reasoning

### Example Queries

- "Explain quantum-neural hybrid computing"
- "How does quantum superposition enhance reasoning?"
- "What is the relationship between quantum entanglement and memory retrieval?"
- "How does the system represent knowledge in vector space?"
- "What agents are currently active in the system?"

### Understanding Quantum Effects

When NeuroFusionOS processes queries, it may display "Quantum Effects" that influenced the reasoning:

- **Superposition Advantage**: System explored multiple reasoning paths simultaneously
- **Constructive Interference**: Quantum effects amplified certain reasoning pathways
- **Destructive Interference**: Quantum effects suppressed less promising pathways
- **Entanglement Effect**: Concepts were linked through quantum entanglement to improve reasoning
- **Uncertainty Reduction**: Quantum principles helped reduce uncertainty in results

## System Architecture

NeuroFusionOS consists of several key components:

### Backend Components

- **Memory Manager**: Stores and retrieves information in vector space
- **Agent Manager**: Coordinates specialized agents for different tasks
- **Reasoning Chain**: Processes queries through multiple reasoning steps
- **Quantum Simulator**: Simulates quantum operations for reasoning enhancement

### Frontend Components

- **Dashboard**: Displays system status and statistics
- **Neural Visualization**: 3D visualization of the system's neural network
- **Quantum Circuit Visualizer**: Shows quantum operations and states
- **Memory Visualization**: Displays memory vectors in 3D space
- **Command Interface**: Allows user interaction through natural language

### API Endpoints

- `/api/status`: Get system status information
- `/api/query`: Process a query through the system
- `/api/memory`: Access memory storage functions
- `/api/agents`: Manage system agents
- `/api/quantum/state`: Get quantum state information
- `/api/quantum/circuit`: Run quantum circuit simulations
- `/api/quantum/reasoning`: Apply quantum reasoning to a problem

## Development

### Project Structure

```
neurofusion-os/
├── agents/              # Agent system modules
├── api/                 # API routes and controllers
├── chains/              # Reasoning chain implementation
├── memory/              # Memory management system
├── public/              # Frontend assets and interface
│   ├── js/              # JavaScript frontend code
│   ├── css/             # Styling
│   ├── assets/          # Images and other assets
│   ├── index.html       # Standard interface
│   └── advanced-interface.html  # Advanced 3D interface
├── quantum/             # Quantum simulation and reasoning
└── server.js            # Main server file
```

### Extending the System

To add new capabilities:

1. **New Agents**: Add agent files to the `agents/` directory and register them in `agentManager.js`
2. **Custom Reasoning**: Extend the reasoning chain in `chains/reasoningChain.js`
3. **Enhanced Visualization**: Modify the Three.js visualization in the frontend
4. **Additional API Routes**: Add new routes to `api/routes.js`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by advancements in quantum computing and neural networks
- Uses Three.js for 3D visualization
- Built with Node.js and Express

---

NeuroFusionOS - Expanding the boundaries of artificial intelligence through quantum-neural hybridization