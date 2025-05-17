/**
 * Floating Pi Background Effect
 * Creates decorative floating Pi symbols in the background
 */

const FloatingPiBackground = (function() {
  // Private variables
  let container = null;
  let symbols = [];
  let animationFrameId = null;
  
  // Configuration
  const config = {
    count: 15,
    minSize: 20,
    maxSize: 60,
    minSpeed: 0.2,
    maxSpeed: 0.8,
    symbols: ['π', '∏', '∑', '∞'] // Pi and related mathematical symbols
  };
  
  // Initialize the effect
  function init(containerId) {
    container = document.getElementById(containerId);
    if (!container) return;
    
    // Create symbols
    createSymbols();
    
    // Start animation loop
    animate();
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
  }
  
  // Create floating symbols
  function createSymbols() {
    symbols = [];
    
    for (let i = 0; i < config.count; i++) {
      const symbol = document.createElement('div');
      symbol.className = 'floating-symbol';
      
      // Random properties
      const size = Math.random() * (config.maxSize - config.minSize) + config.minSize;
      const x = Math.random() * 100; // percentage
      const y = Math.random() * 100; // percentage
      const speed = Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed;
      const delay = Math.random() * 5;
      const symbolChar = config.symbols[Math.floor(Math.random() * config.symbols.length)];
      const opacity = Math.random() * 0.15 + 0.05;
      
      // Set style
      symbol.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${y}%;
        font-size: ${size}px;
        color: rgba(255, 255, 255, ${opacity});
        transform: translate(-50%, -50%);
        pointer-events: none;
        user-select: none;
        text-shadow: 0 0 10px rgba(100, 180, 255, 0.3);
      `;
      
      symbol.textContent = symbolChar;
      container.appendChild(symbol);
      
      // Store symbol data
      symbols.push({
        element: symbol,
        x, y,
        speed,
        delay,
        animationProgress: Math.random() * Math.PI * 2 // Random start phase
      });
    }
  }
  
  // Animation loop
  function animate() {
    symbols.forEach(symbol => {
      symbol.animationProgress += symbol.speed / 100;
      
      // Calculate new position with subtle floating effect
      const offsetY = Math.sin(symbol.animationProgress) * 2;
      const offsetX = Math.cos(symbol.animationProgress * 0.8) * 1.5;
      
      symbol.element.style.transform = `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px)`;
    });
    
    animationFrameId = requestAnimationFrame(animate);
  }
  
  // Handle window resize
  function handleResize() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    
    // Clear existing symbols
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    // Recreate with new dimensions
    createSymbols();
    
    // Resume animation
    animate();
  }
  
  // Clean up resources
  function destroy() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    
    window.removeEventListener('resize', handleResize);
    
    // Clear symbols
    if (container) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }
  }
  
  // Public API
  return {
    init,
    destroy
  };
})();