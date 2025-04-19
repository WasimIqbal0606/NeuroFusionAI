// NeuralVisualization.jsx - Three.js visualization component

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { gsap } from 'gsap';

const NeuralVisualization = ({ systemStatus, queryResponse }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const composerRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const nodesRef = useRef([]);
  const edgesRef = useRef([]);
  const frameIdRef = useRef(null);
  
  // Initialize scene
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0c1d);
    sceneRef.current = scene;
    
    // Renderer setup
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 50;
    cameraRef.current = camera;
    
    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controlsRef.current = controls;
    
    // Post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      1.5,   // strength
      0.4,   // radius
      0.85   // threshold
    );
    composer.addPass(bloomPass);
    composerRef.current = composer;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // Add point light
    const pointLight = new THREE.PointLight(0x3a36e0, 2, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // Create quantum field (large sphere with particles)
    createQuantumField(scene);
    
    // Create neural network
    createNeuralNetwork(scene);
    
    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      // Update controls
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      // Animate nodes
      animateNodes();
      
      // Render scene
      if (composerRef.current) {
        composerRef.current.render();
      }
    };
    
    animate();
    
    // Window resize handler
    const handleResize = () => {
      if (mountRef.current && cameraRef.current && rendererRef.current && composerRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        
        rendererRef.current.setSize(width, height);
        composerRef.current.setSize(width, height);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose geometries and materials
      nodesRef.current.forEach(node => {
        if (node.geometry) node.geometry.dispose();
        if (node.material) node.material.dispose();
      });
      
      edgesRef.current.forEach(edge => {
        if (edge.geometry) edge.geometry.dispose();
        if (edge.material) edge.material.dispose();
      });
    };
  }, []);
  
  // React to query responses
  useEffect(() => {
    if (queryResponse && nodesRef.current.length > 0) {
      // Pulse the neural network nodes to indicate activity
      pulseNodes();
    }
  }, [queryResponse]);
  
  // React to system status changes
  useEffect(() => {
    if (systemStatus && systemStatus.active_agents && sceneRef.current) {
      // Update visualization based on active agents
      updateVisualizationActivity(systemStatus.active_agents.length);
    }
  }, [systemStatus]);
  
  // Create quantum field effect
  const createQuantumField = (scene) => {
    // Create particle system for quantum field
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const color = new THREE.Color();
    
    for (let i = 0; i < particleCount; i++) {
      // Position particles in a sphere
      const radius = 40 + (Math.random() * 30);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Randomize color between blue and cyan
      const ratio = Math.random();
      color.setHSL(0.6 + (ratio * 0.05), 0.7, 0.5 + (ratio * 0.5));
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Randomize size
      sizes[i] = Math.random() * 2;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Create particle material
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    // Create particle system
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    
    // Animate particle system
    gsap.to(particleSystem.rotation, {
      x: Math.PI * 2,
      y: Math.PI,
      duration: 200,
      ease: 'linear',
      repeat: -1
    });
  };
  
  // Create neural network visualization
  const createNeuralNetwork = (scene) => {
    // Neural network parameters
    const layers = [8, 14, 18, 14, 8]; // Nodes per layer
    const layerDistance = 10;
    const nodeSize = 0.4;
    
    // Create nodes and connections
    const nodes = [];
    const edges = [];
    
    // Materials
    const nodeMaterial = new THREE.MeshPhongMaterial({
      color: 0x3a36e0,
      emissive: 0x3a36e0,
      emissiveIntensity: 0.5,
      shininess: 100
    });
    
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x3a36e0,
      transparent: true,
      opacity: 0.3
    });
    
    // Node geometry
    const nodeGeometry = new THREE.SphereGeometry(nodeSize, 16, 16);
    
    // Create nodes for each layer
    layers.forEach((nodeCount, layerIndex) => {
      const layerNodes = [];
      const layerX = (layerIndex - (layers.length - 1) / 2) * layerDistance;
      
      // Create nodes for this layer
      for (let i = 0; i < nodeCount; i++) {
        const y = (i - (nodeCount - 1) / 2) * 2;
        const z = 0;
        
        const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
        nodeMesh.position.set(layerX, y, z);
        
        // Add random movement
        nodeMesh.userData = {
          originalPosition: new THREE.Vector3(layerX, y, z),
          pulseValue: 0,
          speed: Math.random() * 0.01,
          activity: 0.2 + Math.random() * 0.3 // Base activity level
        };
        
        scene.add(nodeMesh);
        layerNodes.push(nodeMesh);
        nodes.push(nodeMesh);
      }
      
      // Connect to next layer
      if (layerIndex < layers.length - 1) {
        const nextLayerNodes = layers[layerIndex + 1];
        
        layerNodes.forEach((node) => {
          // Connect to a random subset of nodes in the next layer
          const connectionsCount = Math.floor(1 + Math.random() * 3);
          
          for (let i = 0; i < connectionsCount; i++) {
            const targetIndex = Math.floor(Math.random() * nextLayerNodes);
            const targetY = (targetIndex - (nextLayerNodes - 1) / 2) * 2;
            const targetX = (layerIndex + 1 - (layers.length - 1) / 2) * layerDistance;
            
            // Create edge
            const edgeGeometry = new THREE.BufferGeometry();
            const points = [
              node.position,
              new THREE.Vector3(targetX, targetY, 0)
            ];
            edgeGeometry.setFromPoints(points);
            
            const edge = new THREE.Line(edgeGeometry, edgeMaterial.clone());
            scene.add(edge);
            edges.push(edge);
            
            // Store connection info
            edge.userData = {
              startNode: node,
              endPosition: new THREE.Vector3(targetX, targetY, 0),
              activity: 0.1 + Math.random() * 0.2 // Base activity level
            };
          }
        });
      }
    });
    
    // Store references
    nodesRef.current = nodes;
    edgesRef.current = edges;
  };
  
  // Animate neural network nodes
  const animateNodes = () => {
    if (!nodesRef.current || !edgesRef.current) return;
    
    // Update nodes
    nodesRef.current.forEach(node => {
      if (!node || !node.userData) return;
      
      // Small random movement around original position
      const time = Date.now() * node.userData.speed;
      node.position.x = node.userData.originalPosition.x + Math.sin(time) * 0.1;
      node.position.y = node.userData.originalPosition.y + Math.cos(time * 0.7) * 0.1;
      node.position.z = node.userData.originalPosition.z + Math.sin(time * 0.5) * 0.1;
      
      // Update pulse effect
      if (node.userData.pulseValue > 0) {
        node.userData.pulseValue -= 0.01;
        
        // Update node appearance based on pulse
        const scale = 1 + node.userData.pulseValue * 0.5;
        node.scale.set(scale, scale, scale);
        
        // Update material based on pulse
        if (node.material) {
          node.material.emissiveIntensity = 0.5 + node.userData.pulseValue;
        }
      } else {
        node.userData.pulseValue = 0;
        node.scale.set(1, 1, 1);
        
        if (node.material) {
          node.material.emissiveIntensity = 0.5 + (Math.sin(time * 2) * 0.1 * node.userData.activity);
        }
      }
    });
    
    // Update edges
    edgesRef.current.forEach(edge => {
      if (!edge || !edge.userData || !edge.userData.startNode) return;
      
      // Update edge start position to follow node
      const points = [
        edge.userData.startNode.position,
        edge.userData.endPosition
      ];
      
      // Update geometry
      edge.geometry.setFromPoints(points);
      
      // Update material based on node activity
      if (edge.material && edge.userData.startNode.userData) {
        edge.material.opacity = 0.1 + (edge.userData.startNode.userData.pulseValue * 0.5) + 
                                (Math.sin(Date.now() * 0.001) * 0.1 * edge.userData.activity);
      }
    });
  };
  
  // Pulse the neural network to indicate activity
  const pulseNodes = () => {
    // Start with input layer nodes
    const startNodes = nodesRef.current.slice(0, 8);
    
    // Pulse through the network
    startNodes.forEach(node => {
      if (!node || !node.userData) return;
      
      // Set initial pulse
      node.userData.pulseValue = 1;
      
      // Propagate pulse through the network with delays
      propagatePulse(node, 0);
    });
  };
  
  // Propagate pulse through connected nodes
  const propagatePulse = (node, delay) => {
    if (!node || !edgesRef.current) return;
    
    // Find edges that start from this node
    const connectedEdges = edgesRef.current.filter(edge => 
      edge.userData && edge.userData.startNode === node
    );
    
    // Pulse connected nodes with delay
    connectedEdges.forEach((edge, index) => {
      // Find the node at the end position
      const targetNode = nodesRef.current.find(n => 
        n.position.distanceTo(edge.userData.endPosition) < 0.5
      );
      
      if (targetNode) {
        // Delay pulse based on network depth
        setTimeout(() => {
          targetNode.userData.pulseValue = 0.8;
          propagatePulse(targetNode, delay + 100);
        }, delay + 100 + (index * 50));
      }
    });
  };
  
  // Update visualization based on system activity
  const updateVisualizationActivity = (agentCount) => {
    if (!nodesRef.current || !edgesRef.current) return;
    
    // Scale activity based on number of active agents
    const activityLevel = 0.2 + (agentCount / 10);
    
    // Update node activity
    nodesRef.current.forEach(node => {
      if (node && node.userData) {
        node.userData.activity = activityLevel + (Math.random() * 0.2);
      }
    });
    
    // Update edge activity
    edgesRef.current.forEach(edge => {
      if (edge && edge.userData) {
        edge.userData.activity = activityLevel * 0.8 + (Math.random() * 0.1);
      }
    });
  };
  
  return (
    <div 
      className="neural-visualization" 
      ref={mountRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default NeuralVisualization;