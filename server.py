"""
NeuroFusionOS Server
An integrated backend that combines FastAPI, Flask, and Streamlit components
"""

import os
import sys
import time
import json
import threading
import subprocess
import asyncio
from datetime import datetime

# Flask for the main server
from flask import Flask, request, jsonify, send_from_directory, render_template
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.serving import run_simple

# FastAPI for API handling
from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel, Field

# Optional: For Streamlit integration
import nest_asyncio
nest_asyncio.apply()

# Import NeuroFusionOS modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from memory.memory_manager import MemoryManager
from agents.agent_manager import AgentManager
from quantum.quantum_simulator import QuantumSimulator
from emotion.emotion_analyzer import EmotionAnalyzer

# Initialize core components
memory_manager = MemoryManager()
agent_manager = AgentManager()
quantum_simulator = QuantumSimulator()
emotion_analyzer = EmotionAnalyzer()

# System start time
system_start_time = time.time()

# Create FastAPI app
fastapi_app = FastAPI(
    title="NeuroFusionOS API",
    description="Quantum-Neural Hybrid AGI System API",
    version="0.9.0"
)

# Add CORS middleware to FastAPI
fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create Flask app
flask_app = Flask(__name__, 
                 static_folder='public',
                 template_folder='public')

# Create Streamlit command
streamlit_cmd = ["streamlit", "run", "streamlit_app.py", 
                "--server.port=8501", 
                "--server.address=0.0.0.0",
                "--browser.serverAddress=localhost"]

# Pydantic models for FastAPI
class QueryRequest(BaseModel):
    query: str = Field(..., description="The query to process")

class EmotionRequest(BaseModel):
    text: str = Field(..., description="Text to analyze for emotion")

class CircuitRequest(BaseModel):
    numQubits: int = Field(..., description="Number of qubits in the circuit")
    gates: list = Field(..., description="Gates to apply in the circuit")

class ReasoningRequest(BaseModel):
    problem: dict = Field(..., description="Problem description and constraints")
    options: list = Field(..., description="Options to evaluate")
    weights: list = Field(None, description="Initial weights for options")

class MemoryRequest(BaseModel):
    data: dict = Field(..., description="Memory data to store")

#===========================
# FastAPI routes
#===========================

@fastapi_app.get("/api/status")
async def get_status():
    """Get the current system status"""
    active_agents = agent_manager.get_active_agents()
    memories = memory_manager.get_all_memories()
    
    return {
        "status": "operational",
        "system_version": "0.9.0",
        "uptime": time.time() - system_start_time,
        "active_agents": [agent["name"] for agent in active_agents],
        "memory_count": len(memories),
        "memory_usage": {
            "heapUsed": 0,  # This would be populated with actual values in a real system
            "heapTotal": 0,
            "external": 0
        },
        "quantum_state": {
            "initialized": quantum_simulator.initialized,
            "dimension": quantum_simulator.dimension
        }
    }

@fastapi_app.post("/api/query")
async def process_query(request: QueryRequest):
    """Process a query through the reasoning chain"""
    try:
        # Store the query in memory
        memory_manager.store_query(request.query)
        
        # Get relevant context
        context = memory_manager.retrieve_relevant_context(request.query)
        
        # Process the query through the reasoning chain
        result = agent_manager.process_query(request.query, context)
        
        # Store the result
        memory_manager.store_memory({
            "type": "reasoning_result",
            "query": request.query,
            "result": result["result"],
            "confidence": result["confidence"],
            "timestamp": time.time()
        })
        
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@fastapi_app.post("/api/analyze-emotion")
async def analyze_emotion(request: EmotionRequest):
    """Analyze the emotional content of text"""
    try:
        result = emotion_analyzer.analyze(request.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing emotion: {str(e)}")

@fastapi_app.get("/api/quantum/state")
async def get_quantum_state():
    """Get the current quantum state"""
    try:
        # Ensure the quantum simulator is initialized
        if not quantum_simulator.initialized:
            await quantum_simulator.initialize()
        
        # Get quantum state data
        state_vector = quantum_simulator.state_vector
        probabilities = [amplitude**2 for amplitude in state_vector]
        measurement = quantum_simulator.measure()
        
        return {
            "num_qubits": quantum_simulator.num_qubits,
            "state_size": len(state_vector),
            "probabilities": probabilities,
            "measurement": measurement,
            "gate_history": quantum_simulator.gate_history
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting quantum state: {str(e)}")

@fastapi_app.post("/api/quantum/circuit")
async def run_quantum_circuit(request: CircuitRequest):
    """Run a quantum circuit simulation"""
    try:
        # Simulate the circuit
        final_state = quantum_simulator.simulate_circuit(request.numQubits, request.gates)
        probabilities = [amplitude**2 for amplitude in final_state]
        
        # Generate binary representation of states
        states = []
        for idx, prob in enumerate(probabilities):
            if prob > 0.001:  # Filter out near-zero probabilities
                states.append({
                    "state": format(idx, f'0{request.numQubits}b'),
                    "probability": prob
                })
        
        # Sort states by probability
        states.sort(key=lambda x: x["probability"], reverse=True)
        
        return {
            "num_qubits": request.numQubits,
            "circuit": request.gates,
            "states": states,
            "most_likely": states[0] if states else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error simulating quantum circuit: {str(e)}")

@fastapi_app.post("/api/quantum/reasoning")
async def apply_quantum_reasoning(request: ReasoningRequest):
    """Apply quantum reasoning to a decision problem"""
    try:
        # Ensure quantum simulator is initialized
        if not quantum_simulator.initialized:
            quantum_simulator.initialize()
        
        # Apply quantum reasoning
        result = quantum_simulator.apply_quantum_reasoning(
            request.problem,
            request.options,
            request.weights
        )
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error applying quantum reasoning: {str(e)}")

@fastapi_app.get("/api/memory")
async def get_memories():
    """Get all memories"""
    try:
        memories = memory_manager.get_all_memories()
        return {"memories": memories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting memories: {str(e)}")

@fastapi_app.post("/api/memory")
async def store_memory(request: MemoryRequest):
    """Store a new memory"""
    try:
        memory = memory_manager.store_memory(request.data)
        return {"memory": memory}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error storing memory: {str(e)}")

@fastapi_app.get("/api/agents")
async def get_agents():
    """Get all agents"""
    try:
        agents = agent_manager.get_agents()
        active_agents = agent_manager.get_active_agents()
        
        return {
            "total_agents": len(agents),
            "active_agents": len(active_agents),
            "agents": agents
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting agents: {str(e)}")

@fastapi_app.post("/api/agents/{agent_id}/activate")
async def activate_agent(agent_id: str):
    """Activate an agent"""
    try:
        result = agent_manager.activate_agent(agent_id)
        if not result:
            raise HTTPException(status_code=404, detail="Agent not found or already active")
        
        return {"success": True, "agent": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error activating agent: {str(e)}")

@fastapi_app.post("/api/agents/{agent_id}/deactivate")
async def deactivate_agent(agent_id: str):
    """Deactivate an agent"""
    try:
        result = agent_manager.deactivate_agent(agent_id)
        if not result:
            raise HTTPException(status_code=404, detail="Agent not found or already inactive")
        
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deactivating agent: {str(e)}")

@fastapi_app.post("/api/agents/{agent_id}/execute")
async def execute_agent_task(agent_id: str, task: str, data: dict = None):
    """Execute a task with a specific agent"""
    try:
        result = agent_manager.execute_agent_task(agent_id, task, data or {})
        if not result:
            raise HTTPException(status_code=404, detail="Agent not found or task failed")
        
        return {"result": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error executing agent task: {str(e)}")

#===========================
# Flask routes
#===========================

@flask_app.route('/')
def index():
    """Serve the main HTML page"""
    return send_from_directory('public', 'index.html')

@flask_app.route('/<path:path>')
def serve_static(path):
    """Serve static files"""
    return send_from_directory('public', path)

@flask_app.route('/test')
def test_page():
    """Serve the test HTML page"""
    return send_from_directory('public', 'test.html')

@flask_app.route('/api/flask/status')
def flask_status():
    """Get Flask-specific status"""
    return jsonify({
        "service": "Flask",
        "status": "operational",
        "timestamp": datetime.now().isoformat()
    })

#===========================
# Server integration
#===========================

# Create a combined app that handles both Flask and FastAPI
def create_combined_app():
    # Mount the FastAPI app under /api
    app = DispatcherMiddleware(
        flask_app,
        {
            '/fastapi': fastapi_app
        }
    )
    return app

# Run Streamlit in a separate thread
def run_streamlit():
    process = subprocess.Popen(
        streamlit_cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True
    )
    
    # Read and print Streamlit output
    for line in process.stdout:
        print(f"Streamlit: {line.strip()}")
    
    # Check for errors
    for line in process.stderr:
        print(f"Streamlit Error: {line.strip()}")
    
    process.wait()

# Main function to start all servers
def main():
    print("Starting NeuroFusionOS...")
    
    # Initialize components
    memory_manager.initialize()
    agent_manager.initialize()
    quantum_simulator.initialize()
    emotion_analyzer.initialize()
    
    # Start Streamlit in a separate thread
    streamlit_thread = threading.Thread(target=run_streamlit)
    streamlit_thread.daemon = True
    streamlit_thread.start()
    print("Streamlit server started in background")
    
    # Create combined app
    app = create_combined_app()
    
    # Start the combined server
    run_simple(
        'localhost', 
        3000, 
        app, 
        use_reloader=True, 
        use_debugger=True,
        threaded=True
    )

if __name__ == "__main__":
    main()