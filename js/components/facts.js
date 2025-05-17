/**
 * Pi Facts Component
 * Manages and rotates interesting Pi facts
 */

const PiFacts = (function() {
  // Collection of interesting Pi facts
  const facts = [
    "Pi (π) is the ratio of a circle's circumference to its diameter.",
    "The first 144 digits of Pi sum up to 666, which many associate with the Number of the Beast.",
    "Pi is an irrational number, meaning it cannot be expressed as a simple fraction.",
    "The record for calculating Pi is over 100 trillion digits.",
    "March 14 (3/14) is celebrated as Pi Day in many countries.",
    "If you write π/4 as a continued fraction, you get the Leibniz formula: 1 - 1/3 + 1/5 - 1/7 + ...",
    "The symbol π was first used by Welsh mathematician William Jones in 1706.",
    "No pattern has ever been found in the digits of Pi, making it useful for random number generation.",
    "Albert Einstein was born on Pi Day (March 14).",
    "In the Star Trek episode 'Wolf in the Fold,' Spock defeats an evil computer by commanding it to 'compute to the last digit the value of pi.'"
  ];
  
  let currentFactIndex = 0;
  let factElement = null;
  let intervalId = null;
  
  // Initialize facts display
  function init(elementId) {
    factElement = document.getElementById(elementId);
    if (!factElement) return;
    
    displayFact(currentFactIndex);
    
    // Rotate facts every 8 seconds
    intervalId = setInterval(rotateFact, 8000);
  }
  
  // Display a specific fact
  function displayFact(index) {
    if (!factElement) return;
    
    // Fade out
    factElement.style.opacity = 0;
    
    // Update content and fade in after a delay
    setTimeout(() => {
      factElement.textContent = facts[index];
      factElement.style.opacity = 1;
    }, 500);
  }
  
  // Rotate to the next fact
  function rotateFact() {
    currentFactIndex = (currentFactIndex + 1) % facts.length;
    displayFact(currentFactIndex);
  }
  
  // Clean up
  function destroy() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
  
  // Public API
  return {
    init,
    destroy
  };
})();