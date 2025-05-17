/**
 * Main Application Controller
 * Coordinates visualizations, data loading, and UI interactions
 */

// Main application controller
const App = (function() {
  // App state
  let state = {
    currentVisualization: null,
    activeInstance: null,
    isLoading: false
  };
  
  // Visualization instances
  let visualizations = {
    grid: null,
    spiral: null,
    walk: null
  };
  
  // Initialize application
  function init() {
    // Initialize components
    UI.init();
    PiFacts.init('pi-fact');
    FloatingPiBackground.init('floating-pi-container');
    
    // Initialize Pi digits
    PiDigits.init().then(digitCount => {
      // Update UI with initial digit count
      UI.updateDigitCount(digitCount);
      
      // Initial visualization (grid)
      changeVisualization('grid');
      
      // Set up event listeners for UI interactions
      setupEventListeners();
    });
    
    // Handle window resize
    window.addEventListener('resize', debounce(() => {
      if (state.activeInstance) {
        state.activeInstance.resize();
      }
    }, 200));
  }
  
  // Set up event listeners
  function setupEventListeners() {
    // Listen for visualization change events
    document.addEventListener('visualizationChange', event => {
      changeVisualization(event.detail.visualization);
    });
    
    // Listen for continue digits events
    document.addEventListener('continueDigits', event => {
      loadMoreDigits(event.detail.targetCount);
    });
    
    // Listen for reset walk events
    document.addEventListener('resetWalk', () => {
      if (state.currentVisualization === 'walk' && visualizations.walk) {
        visualizations.walk.reset();
      }
    });
  }
  
  // Change active visualization
  function changeVisualization(vizType) {
    // Guard against invalid visualization types
    if (!['grid', 'spiral', 'walk'].includes(vizType)) return;
    
    // Skip if same visualization is already active
    if (state.currentVisualization === vizType && state.activeInstance) return;
    
    const canvasContainer = document.getElementById('canvas-container');
    
    // Destroy previous visualization
    if (state.activeInstance) {
      state.activeInstance.destroy();
    }
    
    // Initialize requested visualization if not already
    if (!visualizations[vizType]) {
      visualizations[vizType] = createVisualization(vizType, canvasContainer);
    } else {
      // Reinitialize if previously destroyed
      visualizations[vizType] = createVisualization(vizType, canvasContainer);
    }
    
    // Update state
    state.currentVisualization = vizType;
    state.activeInstance = visualizations[vizType];
  }
  
  // Create visualization instance
  function createVisualization(type, container) {
    switch (type) {
      case 'grid':
        return GridVisualization.init(container, PiDigits);
      case 'spiral':
        return SpiralVisualization.init(container, PiDigits);
      case 'walk':
        return WalkVisualization.init(container, PiDigits);
      default:
        return null;
    }
  }
  
  // Load more Pi digits
  function loadMoreDigits(targetCount) {
    if (state.isLoading) return;
    
    state.isLoading = true;
    UI.showLoading(true);
    
    PiDigits.loadMoreDigits(targetCount)
      .then(newCount => {
        // Update UI with new digit count
        UI.updateDigitCount(newCount);
        
        // Update current visualization
        if (state.activeInstance) {
          state.activeInstance.update(PiDigits);
        }
        
        // Hide loading screen
        UI.showLoading(false);
        state.isLoading = false;
      });
  }
  
  // Clean up resources
  function destroy() {
    // Clean up visualizations
    Object.values(visualizations).forEach(viz => {
      if (viz) viz.destroy();
    });
    
    // Clean up components
    UI.destroy();
    PiFacts.destroy();
    FloatingPiBackground.destroy();
    
    // Remove event listeners
    document.removeEventListener('visualizationChange', changeVisualization);
    document.removeEventListener('continueDigits', loadMoreDigits);
    window.removeEventListener('resize', () => {});
  }
  
  // Public API
  return {
    init,
    destroy
  };
})();

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});