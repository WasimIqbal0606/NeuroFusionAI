// routes.js - API routes for NeuroFusionOS
const express = require('express');
const router = express.Router();
const reasoningChain = require('../chains/reasoningChain');
const memoryManager = require('../memory/memoryManager');
const agentManager = require('../agents/agentManager');
const quantumReasoning = require('../quantum/quantumReasoning');
const quantumSimulator = require('../quantum/quantumWorker');

// System start time for uptime calculation
const systemStartTime = Date.now();

/**
 * Get system status
 */
router.get('/status', async (req, res) => {
  try {
    // Get active agents
    const activeAgents = agentManager.getActiveAgents().map(agent => agent.name);
    
    // Get memory stats
    const memories = await memoryManager.getAllMemories();
    
    // Calculate uptime
    const uptime = (Date.now() - systemStartTime) / 1000; // seconds
    
    // Get memory usage
    const memoryUsage = process.memoryUsage();
    
    res.json({
      status: 'operational',
      system_version: '0.9.0',
      uptime,
      active_agents: activeAgents,
      memory_count: memories.length,
      memory_usage: memoryUsage,
      quantum_state: {
        initialized: quantumReasoning.initialized,
        dimension: quantumReasoning.stateDimension
      }
    });
  } catch (error) {
    console.error('Error getting system status:', error);
    res.status(500).json({ error: 'Failed to get system status' });
  }
});

/**
 * Process a query
 */
router.post('/query', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    console.log(`Received query: ${query}`);
    
    // Store the query in memory
    await memoryManager.storeQuery(query);
    
    // Get relevant context from memory
    const context = await memoryManager.retrieveRelevantContext(query);
    
    // Process the query through the reasoning chain
    const result = await reasoningChain.process(query, { context });
    
    // Store the result in memory
    await memoryManager.storeMemory({
      type: 'reasoning_result',
      query,
      result: result.result,
      confidence: result.confidence,
      timestamp: Date.now()
    });
    
    res.json({ result });
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: 'Failed to process query' });
  }
});

/**
 * Get quantum simulation information
 */
router.get('/quantum/state', async (req, res) => {
  try {
    // Ensure the quantum simulator is initialized
    if (!quantumSimulator.initialized) {
      await quantumSimulator.initialize();
    }
    
    // Get current quantum state
    const stateVector = quantumSimulator.stateVector;
    
    // Calculate probabilities
    const probabilities = stateVector.map(amplitude => amplitude * amplitude);
    
    // Measure the state (note: this will collapse the state)
    const measurement = quantumSimulator.measure();
    
    res.json({
      num_qubits: quantumSimulator.numQubits,
      state_size: stateVector.length,
      probabilities,
      measurement,
      gate_history: quantumSimulator.gateHistory
    });
  } catch (error) {
    console.error('Error getting quantum state:', error);
    res.status(500).json({ error: 'Failed to get quantum state' });
  }
});

/**
 * Run a quantum circuit simulation
 */
router.post('/quantum/circuit', async (req, res) => {
  try {
    const { numQubits, gates } = req.body;
    
    if (!numQubits || !gates) {
      return res.status(400).json({ 
        error: 'Number of qubits and gates are required',
        required_format: {
          numQubits: 3,
          gates: [
            { type: 'H', qubit: 0 },
            { type: 'CNOT', control: 0, target: 1 },
            { type: 'X', qubit: 2 }
          ]
        }
      });
    }
    
    // Simulate the circuit
    const finalState = quantumSimulator.simulateCircuit(numQubits, gates);
    
    // Calculate probabilities
    const probabilities = finalState.map(amplitude => amplitude * amplitude);
    
    // Generate binary representation of states
    const states = probabilities.map((prob, idx) => ({
      state: idx.toString(2).padStart(numQubits, '0'),
      probability: prob
    })).filter(s => s.probability > 0.001); // Filter out near-zero probabilities
    
    res.json({
      num_qubits: numQubits,
      circuit: gates,
      states,
      most_likely: states.sort((a, b) => b.probability - a.probability)[0]
    });
  } catch (error) {
    console.error('Error simulating quantum circuit:', error);
    res.status(500).json({ error: 'Failed to simulate quantum circuit' });
  }
});

/**
 * Apply quantum reasoning to enhance a decision problem
 */
router.post('/quantum/reasoning', async (req, res) => {
  try {
    const { problem, options, weights } = req.body;
    
    if (!problem || !options) {
      return res.status(400).json({ 
        error: 'Problem description and options are required',
        required_format: {
          problem: {
            description: "Choose the best framework",
            constraints: [
              { type: "requirement", value: "performance", weight: 0.8 }
            ]
          },
          options: [
            { id: "option1", description: "Framework A" },
            { id: "option2", description: "Framework B" }
          ],
          weights: [0.5, 0.5] // Optional
        }
      });
    }
    
    // Ensure quantum reasoning is initialized
    if (!quantumReasoning.initialized) {
      quantumReasoning.initialize();
    }
    
    // Apply quantum reasoning
    const result = quantumReasoning.applyQuantumReasoning(problem, options, weights);
    
    res.json(result);
  } catch (error) {
    console.error('Error applying quantum reasoning:', error);
    res.status(500).json({ error: 'Failed to apply quantum reasoning' });
  }
});

/**
 * Get all memories
 */
router.get('/memory', async (req, res) => {
  try {
    const memories = await memoryManager.getAllMemories();
    res.json({ memories });
  } catch (error) {
    console.error('Error getting memories:', error);
    res.status(500).json({ error: 'Failed to get memories' });
  }
});

/**
 * Store a new memory
 */
router.post('/memory', async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'Memory data is required' });
    }
    
    const memory = await memoryManager.storeMemory(data);
    res.json({ memory });
  } catch (error) {
    console.error('Error storing memory:', error);
    res.status(500).json({ error: 'Failed to store memory' });
  }
});

/**
 * Get agents status
 */
router.get('/agents', async (req, res) => {
  try {
    const agents = await agentManager.getAgents();
    const activeAgents = agentManager.getActiveAgents();
    
    res.json({
      total_agents: agents.length,
      active_agents: activeAgents.length,
      agents
    });
  } catch (error) {
    console.error('Error getting agents:', error);
    res.status(500).json({ error: 'Failed to get agents' });
  }
});

/**
 * Activate an agent
 */
router.post('/agents/:agentId/activate', async (req, res) => {
  try {
    const { agentId } = req.params;
    
    if (!agentId) {
      return res.status(400).json({ error: 'Agent ID is required' });
    }
    
    const result = await agentManager.activateAgent(agentId);
    
    if (!result) {
      return res.status(404).json({ error: 'Agent not found or already active' });
    }
    
    res.json({ success: true, agent: result });
  } catch (error) {
    console.error('Error activating agent:', error);
    res.status(500).json({ error: 'Failed to activate agent' });
  }
});

/**
 * Deactivate an agent
 */
router.post('/agents/:agentId/deactivate', async (req, res) => {
  try {
    const { agentId } = req.params;
    
    if (!agentId) {
      return res.status(400).json({ error: 'Agent ID is required' });
    }
    
    const result = await agentManager.deactivateAgent(agentId);
    
    if (!result) {
      return res.status(404).json({ error: 'Agent not found or already inactive' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deactivating agent:', error);
    res.status(500).json({ error: 'Failed to deactivate agent' });
  }
});

/**
 * Execute an agent task
 */
router.post('/agents/:agentId/execute', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { task, data } = req.body;
    
    if (!agentId || !task) {
      return res.status(400).json({ error: 'Agent ID and task are required' });
    }
    
    const result = await agentManager.executeAgentTask(agentId, task, data);
    
    if (!result) {
      return res.status(404).json({ error: 'Agent not found or task failed' });
    }
    
    res.json({ result });
  } catch (error) {
    console.error('Error executing agent task:', error);
    res.status(500).json({ error: 'Failed to execute agent task' });
  }
});

module.exports = router;