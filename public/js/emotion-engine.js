/**
 * NeuroFusionOS Emotion Engine
 * Provides emotional intelligence overlay for AI interactions
 */

class EmotionEngine {
  constructor() {
    // Emotion states
    this.emotions = [
      'neutral', 'happy', 'sad', 'surprised', 
      'curious', 'confused', 'excited', 'thoughtful'
    ];
    
    // Current emotion state
    this.currentEmotion = 'neutral';
    this.emotionIntensity = 0.5; // 0.0 to 1.0
    
    // Emotion history
    this.emotionHistory = [];
    this.maxHistoryLength = 10;
    
    // Initialize the emotion display
    this.emotionDisplay = document.createElement('div');
    this.emotionDisplay.className = 'emotion-display';
    this.initialized = false;
    
    // Initialize
    this.init();
  }
  
  /**
   * Initialize the emotion engine
   */
  init() {
    // Create emotion display
    this.emotionDisplay.innerHTML = `
      <div class="emotion-face">
        <div class="emotion-eyes">
          <div class="emotion-eye left"></div>
          <div class="emotion-eye right"></div>
        </div>
        <div class="emotion-mouth"></div>
      </div>
      <div class="emotion-label">Neutral</div>
    `;
    
    // Style the emotion display
    this.styleEmotionDisplay();
    
    // Add to the DOM
    const header = document.querySelector('header');
    if (header) {
      const logoElement = header.querySelector('.logo');
      if (logoElement) {
        header.insertBefore(this.emotionDisplay, logoElement.nextSibling);
      } else {
        header.appendChild(this.emotionDisplay);
      }
      this.initialized = true;
    } else {
      console.warn('Header element not found for emotion display');
    }
    
    // Set default emotion
    this.setEmotion('neutral', 0.5);
  }
  
  /**
   * Style the emotion display
   */
  styleEmotionDisplay() {
    // Emotion display container
    this.emotionDisplay.style.display = 'flex';
    this.emotionDisplay.style.alignItems = 'center';
    this.emotionDisplay.style.marginLeft = '20px';
    
    // Emotion face
    const face = this.emotionDisplay.querySelector('.emotion-face');
    face.style.width = '36px';
    face.style.height = '36px';
    face.style.borderRadius = '50%';
    face.style.backgroundColor = 'var(--background-light)';
    face.style.display = 'flex';
    face.style.flexDirection = 'column';
    face.style.justifyContent = 'center';
    face.style.alignItems = 'center';
    face.style.position = 'relative';
    face.style.boxShadow = '0 0 8px var(--quantum-glow)';
    face.style.transition = 'all 0.3s ease';
    
    // Emotion eyes container
    const eyes = this.emotionDisplay.querySelector('.emotion-eyes');
    eyes.style.display = 'flex';
    eyes.style.justifyContent = 'space-between';
    eyes.style.width = '20px';
    eyes.style.marginTop = '7px';
    
    // Emotion eyes
    const eyeElements = this.emotionDisplay.querySelectorAll('.emotion-eye');
    eyeElements.forEach(eye => {
      eye.style.width = '6px';
      eye.style.height = '6px';
      eye.style.borderRadius = '50%';
      eye.style.backgroundColor = 'var(--secondary-color)';
      eye.style.transition = 'all 0.3s ease';
    });
    
    // Emotion mouth
    const mouth = this.emotionDisplay.querySelector('.emotion-mouth');
    mouth.style.width = '16px';
    mouth.style.height = '6px';
    mouth.style.borderBottomLeftRadius = '8px';
    mouth.style.borderBottomRightRadius = '8px';
    mouth.style.marginTop = '6px';
    mouth.style.border = '2px solid var(--secondary-color)';
    mouth.style.borderTop = 'none';
    mouth.style.position = 'relative';
    mouth.style.transition = 'all 0.3s ease';
    
    // Emotion label
    const label = this.emotionDisplay.querySelector('.emotion-label');
    label.style.fontSize = '14px';
    label.style.marginLeft = '8px';
    label.style.color = 'var(--text-muted)';
    label.style.fontWeight = '500';
    label.style.transition = 'all 0.3s ease';
  }
  
  /**
   * Analyze text for emotional content
   * @param {string} text - Input text to analyze
   */
  analyzeEmotion(text) {
    if (!text) return;
    
    // In a real implementation, this would call the API
    // For demonstration, we'll use a simple keyword approach
    
    const lowerText = text.toLowerCase();
    let emotion = 'neutral';
    let intensity = 0.5;
    
    // Check for emotion keywords
    if (lowerText.match(/happy|joy|glad|great|excellent|fantastic|amazing/)) {
      emotion = 'happy';
      intensity = 0.8;
    } else if (lowerText.match(/sad|unhappy|disappointed|unfortunate|sorry/)) {
      emotion = 'sad';
      intensity = 0.7;
    } else if (lowerText.match(/surprise|wow|unexpected|incredible|astonishing/)) {
      emotion = 'surprised';
      intensity = 0.9;
    } else if (lowerText.match(/curious|wonder|interested|tell me|what if|how about/)) {
      emotion = 'curious';
      intensity = 0.6;
    } else if (lowerText.match(/confused|unclear|don't understand|complex|complicated/)) {
      emotion = 'confused';
      intensity = 0.7;
    } else if (lowerText.match(/exciting|enthusiastic|looking forward|eager|can't wait/)) {
      emotion = 'excited';
      intensity = 0.8;
    } else if (lowerText.match(/think|consider|analyze|evaluate|assess|ponder/)) {
      emotion = 'thoughtful';
      intensity = 0.6;
    } else {
      // For queries without clear emotion, use a more nuanced approach
      if (text.length < 10) {
        emotion = 'curious';
        intensity = 0.4;
      } else if (text.endsWith('?')) {
        emotion = 'curious';
        intensity = 0.6;
      } else if (text.endsWith('!')) {
        emotion = 'excited';
        intensity = 0.7;
      } else {
        // Call the API instead
        this.fetchEmotionFromAPI(text);
        return;
      }
    }
    
    // Set the detected emotion
    this.setEmotion(emotion, intensity);
  }
  
  /**
   * Fetch emotion analysis from API
   * @param {string} text - Text to analyze
   */
  fetchEmotionFromAPI(text) {
    // Call the backend API for emotion analysis
    fetch('/api/analyze-emotion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    })
    .then(response => response.json())
    .then(data => {
      if (data.emotion) {
        this.setEmotion(data.emotion, data.intensity || 0.5);
      }
    })
    .catch(error => {
      console.error('Error fetching emotion analysis:', error);
      // Fall back to neutral
      this.setEmotion('neutral', 0.5);
    });
  }
  
  /**
   * Set the current emotion
   * @param {string} emotion - Emotion name
   * @param {number} intensity - Emotion intensity (0.0 to 1.0)
   */
  setEmotion(emotion, intensity = 0.5) {
    if (!this.initialized) return;
    
    // Validate emotion
    if (!this.emotions.includes(emotion)) {
      emotion = 'neutral';
    }
    
    // Validate intensity
    intensity = Math.max(0, Math.min(1, intensity));
    
    // Update current state
    this.currentEmotion = emotion;
    this.emotionIntensity = intensity;
    
    // Update history
    this.emotionHistory.unshift({
      emotion,
      intensity,
      timestamp: Date.now()
    });
    
    // Trim history if needed
    if (this.emotionHistory.length > this.maxHistoryLength) {
      this.emotionHistory.pop();
    }
    
    // Update display
    this.updateEmotionDisplay();
  }
  
  /**
   * Update the emotion display based on current emotion
   */
  updateEmotionDisplay() {
    if (!this.initialized) return;
    
    const face = this.emotionDisplay.querySelector('.emotion-face');
    const leftEye = this.emotionDisplay.querySelector('.emotion-eye.left');
    const rightEye = this.emotionDisplay.querySelector('.emotion-eye.right');
    const mouth = this.emotionDisplay.querySelector('.emotion-mouth');
    const label = this.emotionDisplay.querySelector('.emotion-label');
    
    // Set label text
    label.textContent = this.currentEmotion.charAt(0).toUpperCase() + this.currentEmotion.slice(1);
    
    // Get intensity-scaled glow
    const glowIntensity = Math.round(this.emotionIntensity * 10);
    
    // Base styles
    face.style.transform = 'scale(1)';
    leftEye.style.width = '6px';
    leftEye.style.height = '6px';
    rightEye.style.width = '6px';
    rightEye.style.height = '6px';
    leftEye.style.borderRadius = '50%';
    rightEye.style.borderRadius = '50%';
    mouth.style.width = '16px';
    mouth.style.height = '6px';
    mouth.style.borderBottomLeftRadius = '8px';
    mouth.style.borderBottomRightRadius = '8px';
    mouth.style.borderTopLeftRadius = '0';
    mouth.style.borderTopRightRadius = '0';
    mouth.style.border = '2px solid var(--secondary-color)';
    mouth.style.borderTop = 'none';
    
    // Emotion-specific styles
    switch (this.currentEmotion) {
      case 'happy':
        // Wider smile
        mouth.style.width = '20px';
        mouth.style.height = (6 + this.emotionIntensity * 3) + 'px';
        // Glow
        face.style.boxShadow = `0 0 ${glowIntensity}px var(--success-color)`;
        break;
        
      case 'sad':
        // Inverted mouth for frown
        mouth.style.borderBottomLeftRadius = '0';
        mouth.style.borderBottomRightRadius = '0';
        mouth.style.borderTopLeftRadius = '8px';
        mouth.style.borderTopRightRadius = '8px';
        mouth.style.borderBottom = 'none';
        mouth.style.borderTop = '2px solid var(--secondary-color)';
        mouth.style.marginTop = '12px';
        // Slightly droopy eyes
        leftEye.style.transform = 'translateY(1px)';
        rightEye.style.transform = 'translateY(1px)';
        // Glow
        face.style.boxShadow = `0 0 ${glowIntensity}px var(--error-color)`;
        break;
        
      case 'surprised':
        // Wide eyes
        leftEye.style.transform = 'scale(1.3)';
        rightEye.style.transform = 'scale(1.3)';
        // O-shaped mouth
        mouth.style.height = '8px';
        mouth.style.width = '8px';
        mouth.style.borderRadius = '50%';
        mouth.style.border = '2px solid var(--secondary-color)';
        // Glow
        face.style.boxShadow = `0 0 ${glowIntensity}px var(--warning-color)`;
        break;
        
      case 'curious':
        // Tilted head effect
        face.style.transform = 'rotate(5deg)';
        // Slightly raised eyebrow (one eye higher)
        rightEye.style.transform = 'translateY(-1px)';
        // Slightly open mouth
        mouth.style.height = '4px';
        // Glow
        face.style.boxShadow = `0 0 ${glowIntensity}px var(--secondary-color)`;
        break;
        
      case 'confused':
        // Crooked mouth
        mouth.style.transform = 'rotate(-8deg)';
        // Narrow eyes
        leftEye.style.transform = 'scaleY(0.7)';
        rightEye.style.transform = 'scaleY(0.7)';
        // Glow
        face.style.boxShadow = `0 0 ${glowIntensity}px var(--warning-color)`;
        break;
        
      case 'excited':
        // Wide eyes and big smile
        leftEye.style.transform = 'scale(1.2)';
        rightEye.style.transform = 'scale(1.2)';
        mouth.style.width = '22px';
        mouth.style.height = '8px';
        // Subtle animation
        face.style.animation = 'excited-pulse 0.5s infinite alternate';
        // Glow
        face.style.boxShadow = `0 0 ${glowIntensity}px var(--primary-color)`;
        break;
        
      case 'thoughtful':
        // Narrow eyes
        leftEye.style.transform = 'scaleY(0.8)';
        rightEye.style.transform = 'scaleY(0.8)';
        // Small mouth
        mouth.style.width = '10px';
        // Glow
        face.style.boxShadow = `0 0 ${glowIntensity}px var(--primary-color)`;
        break;
        
      case 'neutral':
      default:
        // No special styling
        face.style.boxShadow = `0 0 ${Math.max(3, glowIntensity)}px var(--quantum-glow)`;
        break;
    }
    
    // Add keyframes for excited animation if needed
    if (this.currentEmotion === 'excited' && !document.getElementById('excited-keyframes')) {
      const keyframes = document.createElement('style');
      keyframes.id = 'excited-keyframes';
      keyframes.textContent = `
        @keyframes excited-pulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
      `;
      document.head.appendChild(keyframes);
    } else if (this.currentEmotion !== 'excited') {
      face.style.animation = 'none';
    }
  }
  
  /**
   * Reset the emotion to neutral
   */
  resetEmotion() {
    this.setEmotion('neutral', 0.5);
  }
  
  /**
   * Get the current emotion state
   * @returns {Object} Current emotion state
   */
  getCurrentEmotion() {
    return {
      emotion: this.currentEmotion,
      intensity: this.emotionIntensity,
      history: this.emotionHistory
    };
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.emotionEngine = new EmotionEngine();
});