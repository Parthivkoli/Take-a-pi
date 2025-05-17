/**
 * Utility Functions
 * Helper functions used across the application
 */

// Debounce function to limit function execution frequency
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Get a color based on a digit (0-9)
function getDigitColor(digit, palette, alpha = 1) {
  const color = palette[digit % palette.length];
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
}

// Linear interpolation helper
function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

// Map a value from one range to another
function mapRange(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

// Generate a random number between min and max
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Clamp a value between min and max
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Calculate distance between two points
function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Ease in-out function for smooth animations
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}