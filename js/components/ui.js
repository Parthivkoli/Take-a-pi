/**
 * UI Components and Controls
 * Manages user interface interactions
 */

const UI = (function() {
  // UI elements
  let elements = {
    visualizationButtons: null,
    continueButton: null,
    resetWalkButton: null,
    digitCountElement: null,
    loadingScreen: null
  };
  
  // Current state
  let state = {
    currentVisualization: 'grid',
    isLoading: false
  };
  
  // Initialize UI components
  function init() {
    // Cache UI elements
    elements.visualizationButtons = document.querySelectorAll('.viz-button');
    elements.continueButton = document.getElementById('continue-digits');
    elements.resetWalkButton = document.getElementById('reset-walk');
    elements.digitCountElement = document.getElementById('current-digits');
    elements.loadingScreen = document.getElementById('loading-screen');
    
    // Set up event listeners
    elements.visualizationButtons.forEach(button => {
      button.addEventListener('click', () => handleVisualizationChange(button.dataset.viz));
    });
    
    elements.continueButton.addEventListener('click', handleContinueDigits);
    elements.resetWalkButton.addEventListener('click', handleResetWalk);
    
    // Update UI based on initial state
    updateUI();
  }
  
  // Handle visualization change
  function handleVisualizationChange(vizType) {
    if (state.isLoading || state.currentVisualization === vizType) return;
    
    // Show loading screen
    showLoading(true);
    
    // Update state
    state.currentVisualization = vizType;
    
    // Update button states
    updateUI();
    
    // Notify visualization manager (through event)
    const event = new CustomEvent('visualizationChange', { 
      detail: { visualization: vizType } 
    });
    document.dispatchEvent(event);
    
    // Hide loading screen after a short delay (for transition effect)
    setTimeout(() => showLoading(false), 800);
  }
  
  // Handle continuing Pi digits
  function handleContinueDigits() {
    if (state.isLoading) return;
    
    // Show loading screen
    showLoading(true);
    
    // Notify digit manager (through event)
    const event = new CustomEvent('continueDigits', { 
      detail: { targetCount: 5000 } 
    });
    document.dispatchEvent(event);
  }
  
  // Handle resetting the random walk
  function handleResetWalk() {
    if (state.isLoading) return;
    
    // Notify random walk (through event)
    const event = new CustomEvent('resetWalk');
    document.dispatchEvent(event);
  }
  
  // Update UI based on current state
  function updateUI() {
    // Update visualization buttons
    elements.visualizationButtons.forEach(button => {
      if (button.dataset.viz === state.currentVisualization) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
    
    // Enable/disable reset walk button
    elements.resetWalkButton.disabled = state.currentVisualization !== 'walk';
  }
  
  // Show or hide loading screen
  function showLoading(show) {
    state.isLoading = show;
    
    if (show) {
      elements.loadingScreen.classList.add('active');
    } else {
      elements.loadingScreen.classList.remove('active');
    }
  }
  
  // Update digit count display
  function updateDigitCount(count) {
    if (elements.digitCountElement) {
      elements.digitCountElement.textContent = count;
    }
    
    // Disable continue button if we have 5000 digits
    if (elements.continueButton && count >= 5000) {
      elements.continueButton.disabled = true;
    }
  }
  
  // Clean up resources
  function destroy() {
    // Remove event listeners
    elements.visualizationButtons.forEach(button => {
      button.removeEventListener('click', handleVisualizationChange);
    });
    
    elements.continueButton.removeEventListener('click', handleContinueDigits);
    elements.resetWalkButton.removeEventListener('click', handleResetWalk);
  }
  
  // Public API
  return {
    init,
    updateDigitCount,
    showLoading,
    destroy
  };
})();