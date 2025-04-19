// memoryManager.js - Vector-based memory management for NeuroFusionOS
const crypto = require('crypto');

/**
 * MemoryManager provides vector-based memory storage and retrieval
 * for the NeuroFusionOS system, enabling context-aware reasoning.
 */
class MemoryManager {
  constructor() {
    this.memories = [];
    this.vectorDimension = 128; // Default vector dimension
    this.initialized = false;
    this.maxMemories = 1000; // Maximum number of memories to store
  }
  
  /**
   * Initialize the memory manager
   * @param {number} vectorDimension - Dimension of memory vectors (optional)
   */
  async initialize(vectorDimension = 128) {
    if (this.initialized) {
      console.log('Memory manager already initialized');
      return true;
    }
    
    this.vectorDimension = vectorDimension;
    console.log(`Initializing memory manager with ${vectorDimension} dimensions`);
    
    // Set initialized flag first to prevent recursion
    this.initialized = true;
    
    // Initialize with some seed memories (directly create them to avoid calling storeMemory)
    const seedMemories = [
      {
        type: 'system',
        content: 'NeuroFusionOS initialized with quantum reasoning capabilities',
        timestamp: Date.now()
      },
      {
        type: 'system',
        content: 'Memory subsystem ready for storing and retrieving memories',
        timestamp: Date.now()
      }
    ];
    
    // Create seed memories directly
    for (const data of seedMemories) {
      const id = this._generateId();
      const vector = this._generateVector(data);
      
      this.memories.push({
        id,
        data,
        vector,
        timestamp: data.timestamp || Date.now()
      });
    }
    
    console.log('Memory manager initialized');
    return true;
  }
  
  /**
   * Store a memory with vector embedding
   * @param {Object} data - Memory data to store
   * @returns {Object} Stored memory with ID and vector
   */
  async storeMemory(data) {
    if (!this.initialized) {
      // Initialize without storing seed memories to avoid infinite recursion
      this.vectorDimension = 128;
      console.log(`Quick initialization of memory manager with ${this.vectorDimension} dimensions`);
      this.initialized = true;
    }
    
    // Generate a unique ID
    const id = this._generateId();
    
    // Create vector representation (in production, this would use an embedding model)
    const vector = this._generateVector(data);
    
    // Create memory object
    const memory = {
      id,
      data,
      vector,
      timestamp: data.timestamp || Date.now()
    };
    
    // Add to memories array
    this.memories.push(memory);
    
    // Prune if we exceed maximum memory count
    if (this.memories.length > this.maxMemories) {
      this._pruneMemories();
    }
    
    return memory;
  }
  
  /**
   * Store a user query as a memory
   * @param {string} query - User query
   * @returns {Object} Stored memory
   */
  async storeQuery(query) {
    return this.storeMemory({
      type: 'query',
      content: query,
      timestamp: Date.now()
    });
  }
  
  /**
   * Get all memories
   * @returns {Array} All stored memories
   */
  async getAllMemories() {
    return this.memories.map(memory => ({
      id: memory.id,
      data: memory.data,
      timestamp: memory.timestamp
    }));
  }
  
  /**
   * Get a memory by ID
   * @param {string} id - Memory ID
   * @returns {Object} Memory or null if not found
   */
  async getMemoryById(id) {
    const memory = this.memories.find(m => m.id === id);
    
    if (!memory) {
      return null;
    }
    
    return {
      id: memory.id,
      data: memory.data,
      timestamp: memory.timestamp
    };
  }
  
  /**
   * Retrieve relevant context based on a query
   * @param {string} query - Query to find relevant context for
   * @param {number} maxResults - Maximum number of results to return (default: 5)
   * @returns {Array} Relevant memories sorted by relevance
   */
  async retrieveRelevantContext(query, maxResults = 5) {
    if (!this.initialized || this.memories.length === 0) {
      return [];
    }
    
    // Create vector for the query
    const queryVector = this._generateVector({ content: query });
    
    // Calculate similarity with all memories
    const similarities = this.memories.map(memory => ({
      memory: {
        id: memory.id,
        data: memory.data,
        timestamp: memory.timestamp
      },
      similarity: this._calculateCosineSimilarity(queryVector, memory.vector)
    }));
    
    // Sort by similarity (descending)
    similarities.sort((a, b) => b.similarity - a.similarity);
    
    // Return top results
    return similarities.slice(0, maxResults);
  }
  
  /**
   * Generate a unique memory ID
   * @private
   */
  _generateId() {
    return `mem-${crypto.randomBytes(8).toString('hex')}`;
  }
  
  /**
   * Generate a vector representation of data
   * (Simplified implementation - in production, this would use a proper embedding model)
   * @param {Object} data - Data to vectorize
   * @private
   */
  _generateVector(data) {
    // In a real implementation, this would use a language model to generate embeddings
    // For this simulation, we'll create a deterministic but unique vector based on the content
    
    let content = '';
    
    // Extract text content from various data formats
    if (typeof data === 'string') {
      content = data;
    } else if (data.content) {
      content = data.content;
    } else if (data.query) {
      content = data.query;
    } else if (data.result) {
      content = data.result;
    } else {
      content = JSON.stringify(data);
    }
    
    // Create a hash of the content
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    
    // Use the hash to seed a deterministic random vector
    const vector = new Array(this.vectorDimension).fill(0);
    for (let i = 0; i < this.vectorDimension; i++) {
      // Use characters from the hash to generate vector values
      const hashPart = parseInt(hash.substr(i % 32 * 2, 2), 16);
      vector[i] = (hashPart / 255) * 2 - 1; // Scale to [-1, 1]
    }
    
    // Normalize the vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return vector.map(val => val / magnitude);
  }
  
  /**
   * Calculate cosine similarity between two vectors
   * @param {Array} vector1 - First vector
   * @param {Array} vector2 - Second vector
   * @returns {number} Similarity score between -1 and 1
   * @private
   */
  _calculateCosineSimilarity(vector1, vector2) {
    if (!vector1 || !vector2 || vector1.length !== vector2.length) {
      return -1;
    }
    
    // Calculate dot product
    let dotProduct = 0;
    for (let i = 0; i < vector1.length; i++) {
      dotProduct += vector1[i] * vector2[i];
    }
    
    return dotProduct; // Vectors are already normalized, so dot product equals cosine similarity
  }
  
  /**
   * Prune the memory store to stay within size limits
   * @private
   */
  _pruneMemories() {
    // Sort by timestamp (oldest first)
    this.memories.sort((a, b) => a.timestamp - b.timestamp);
    
    // Remove oldest memories until we're under the limit
    const excessCount = this.memories.length - this.maxMemories;
    if (excessCount > 0) {
      this.memories.splice(0, excessCount);
    }
  }
  
  /**
   * Shutdown the memory manager
   */
  shutdown() {
    this.memories = [];
    this.initialized = false;
    console.log('Memory manager shut down');
  }
}

// Create singleton instance
const memoryManager = new MemoryManager();

module.exports = memoryManager;