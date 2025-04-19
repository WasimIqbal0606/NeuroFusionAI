// server.js - Main server for NeuroFusionOS
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./api/routes');
const memoryManager = require('./memory/memoryManager');
const agentManager = require('./agents/agentManager');
const reasoningChain = require('./chains/reasoningChain');
const quantumSimulator = require('./quantum/quantumWorker');
const quantumReasoning = require('./quantum/quantumReasoning');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', routes);

// Serve front-end files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Test interface
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'test.html'));
});

// Fallback route
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Initialize the system
async function initializeSystem() {
  console.log('Initializing NeuroFusionOS...');
  
  // Initialize memory manager
  await memoryManager.initialize();
  console.log('Memory subsystem initialized');
  
  // Initialize agent manager
  await agentManager.initialize();
  console.log('Agent manager initialized');
  
  // Initialize reasoning chain
  await reasoningChain.initialize();
  console.log('Reasoning chains initialized');
  
  // Initialize quantum simulator
  await quantumSimulator.initialize();
  console.log('Quantum simulator initialized');
  
  // Initialize quantum reasoning
  await quantumReasoning.initialize();
  console.log('Quantum processing initialized');
  
  console.log('NeuroFusionOS initialized successfully');
  
  // Start system monitoring
  startSystemMonitoring();
}

// Process a query through the system
async function processQuery(query) {
  try {
    // Store query in memory
    await memoryManager.storeQuery(query);
    
    // Get relevant context
    const context = await memoryManager.retrieveRelevantContext(query);
    
    // Process through reasoning chain
    const result = await reasoningChain.process(query, { context });
    
    // Store result in memory
    await memoryManager.storeMemory({
      type: 'reasoning_result',
      query,
      result: result.result,
      confidence: result.confidence,
      timestamp: Date.now()
    });
    
    return result;
  } catch (error) {
    console.error('Error processing query:', error);
    return {
      error: `Failed to process query: ${error.message}`,
      query
    };
  }
}

// Handle system command
async function handleSystemCommand(command) {
  switch (command) {
    case 'status':
      return {
        status: 'operational',
        uptime: process.uptime(),
        memory_usage: process.memoryUsage(),
        active_agents: agentManager.getActiveAgents().map(agent => agent.name)
      };
      
    case 'reset':
      await memoryManager.shutdown();
      await agentManager.shutdown();
      await initializeSystem();
      return { status: 'reset_complete' };
      
    default:
      return { error: `Unknown command: ${command}` };
  }
}

// Start system monitoring
function startSystemMonitoring() {
  // Monitor memory usage
  setInterval(() => {
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
    
    if (heapUsedMB / heapTotalMB > 0.9) {
      console.warn(`High memory usage: ${heapUsedMB}MB / ${heapTotalMB}MB`);
    }
  }, 60000); // Check every minute
}

// Start the server
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`NeuroFusionOS server running on port ${PORT}`);
  await initializeSystem();
});

// Export functions for testing
module.exports = {
  processQuery,
  handleSystemCommand
};