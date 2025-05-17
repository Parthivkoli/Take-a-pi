/**
 * Random Walk Visualization Module
 * Visualizes Pi through directional movement with fading trails
 */

const WalkVisualization = (function() {
  // Private variables
  let sketch = null;
  let canvas = null;
  let digits = [];
  let path = [];
  let currentIndex = 0;
  let speed = 2;
  
  // Color palette (similar to other visualizations for consistency)
  const colorPalette = [
    [41, 98, 255],    // 0: Blue
    [93, 58, 252],    // 1: Purple
    [152, 68, 248],   // 2: Violet
    [211, 79, 244],   // 3: Magenta
    [255, 89, 230],   // 4: Pink
    [255, 99, 177],   // 5: Rose
    [255, 109, 124],  // 6: Coral
    [255, 119, 71],   // 7: Orange
    [235, 129, 27],   // 8: Amber
    [200, 139, 0]     // 9: Gold
  ];
  
  // Initialize the visualization
  function init(container, piDigits) {
    digits = piDigits.getAllDigits();
    
    // Define the p5.js sketch
    sketch = (p) => {
      let walker = { x: 0, y: 0 };
      let stepSize = 0;
      let walkStart = true;
      
      p.setup = () => {
        // Create canvas to fit container with 1:1 aspect ratio
        const size = Math.min(container.offsetWidth, container.offsetHeight);
        canvas = p.createCanvas(size, size);
        canvas.parent(container);
        
        // Initialize variables
        stepSize = p.width / 60;
        walker = { x: p.width / 2, y: p.height / 2 };
        path = [{ ...walker, digit: 3 }]; // Start with 3 (first digit of pi)
        currentIndex = 0;
        
        p.frameRate(30);
        p.textAlign(p.CENTER, p.CENTER);
        p.textFont('Poppins');
        p.smooth();
        
        // Draw background once
        p.background(10, 13, 28);
      };
      
      p.draw = () => {
        // Fade background slightly for trail effect
        p.background(10, 13, 28, 10);
        
        // Draw existing path
        drawPath();
        
        // Update walker position if we have more digits to process
        if (currentIndex < digits.length) {
          updateWalker();
        }
        
        // Draw current position with emphasis
        if (path.length > 0) {
          const lastPos = path[path.length - 1];
          p.noStroke();
          
          // Pulsating effect for current position
          const pulseSize = 6 + p.sin(p.frameCount * 0.1) * 2;
          p.fill(255, 200);
          p.circle(lastPos.x, lastPos.y, pulseSize);
          
          // Draw the current digit
          p.fill(255);
          p.textSize(12);
          p.text(lastPos.digit, lastPos.x, lastPos.y);
        }
        
        // Show stats on screen
        showStats();
      };
      
      p.windowResized = () => {
        // Responsive canvas resize
        const size = Math.min(container.offsetWidth, container.offsetHeight);
        p.resizeCanvas(size, size);
        
        // Recalculate step size
        stepSize = p.width / 60;
        
        // Reset walk if resize is significant
        if (Math.abs(size - p.width) > 100) {
          resetWalk();
        }
      };
      
      // Reset the walk to starting position
      function resetWalk() {
        walker = { x: p.width / 2, y: p.height / 2 };
        path = [{ ...walker, digit: 3 }]; // Start with 3 (first digit of pi)
        currentIndex = 0;
        
        // Clear canvas
        p.background(10, 13, 28);
      }
      
      // Draw the entire path
      function drawPath() {
        // Draw connecting lines
        p.noFill();
        p.strokeWeight(2);
        p.beginShape();
        
        for (let i = 0; i < path.length; i++) {
          const point = path[i];
          const digit = point.digit;
          const color = colorPalette[digit];
          
          // Gradient color based on position in path
          const alpha = p.map(i, 0, path.length, 40, 180);
          p.stroke(color[0], color[1], color[2], alpha);
          p.vertex(point.x, point.y);
          
          // Draw small circle and digit at turning points
          if (i > 0 && i < path.length - 1 && i % 10 === 0) {
            p.noStroke();
            p.fill(color[0], color[1], color[2], alpha + 20);
            p.circle(point.x, point.y, 4);
          }
        }
        p.endShape();
      }
      
      // Update walker position based on current digit
      function updateWalker() {
        // Only move every few frames for better visualization
        if (p.frameCount % (30 / speed) !== 0) return;
        
        // Get current digit
        const digit = parseInt(digits[currentIndex]);
        
        // Determine direction based on digit
        // 0-1: up, 2-3: right, 4-5: down, 6-7: left, 8-9: diagonal
        let dx = 0;
        let dy = 0;
        
        switch (digit) {
          case 0:
          case 1:
            dy = -stepSize; // up
            break;
          case 2:
          case 3:
            dx = stepSize; // right
            break;
          case 4:
          case 5:
            dy = stepSize; // down
            break;
          case 6:
          case 7:
            dx = -stepSize; // left
            break;
          case 8:
            dx = stepSize * 0.7; // diagonal up-right
            dy = -stepSize * 0.7;
            break;
          case 9:
            dx = -stepSize * 0.7; // diagonal up-left
            dy = -stepSize * 0.7;
            break;
        }
        
        // Update position
        walker.x += dx;
        walker.y += dy;
        
        // Keep within bounds by wrapping
        if (walker.x < 0) walker.x = p.width;
        if (walker.x > p.width) walker.x = 0;
        if (walker.y < 0) walker.y = p.height;
        if (walker.y > p.height) walker.y = 0;
        
        // Add to path
        path.push({ ...walker, digit: digit });
        
        // Increment index
        currentIndex++;
      }
      
      // Display stats on the canvas
      function showStats() {
        p.noStroke();
        p.fill(255, 200);
        p.textSize(12);
        p.textAlign(p.LEFT, p.TOP);
        p.text(`Digits processed: ${currentIndex}/${digits.length}`, 20, 20);
        p.textAlign(p.CENTER, p.CENTER);
      }
      
      // Make resetWalk function available to the outside
      return {
        resetWalk: resetWalk
      };
    };
    
    // Create new p5 instance with return value
    const sketchInstance = new p5(sketch);
    
    return {
      update: updateDigits,
      resize: resizeCanvas,
      destroy: destroyCanvas,
      reset: () => sketchInstance.resetWalk && sketchInstance.resetWalk()
    };
  }
  
  // Update the digits being visualized
  function updateDigits(piDigits) {
    digits = piDigits.getAllDigits();
  }
  
  // Resize the canvas (called when container size changes)
  function resizeCanvas() {
    if (sketch && sketch.windowResized) {
      sketch.windowResized();
    }
  }
  
  // Clean up when visualization is no longer used
  function destroyCanvas() {
    if (canvas) {
      canvas.remove();
      canvas = null;
    }
  }
  
  // Public API
  return {
    init,
    updateDigits,
    resizeCanvas,
    destroyCanvas
  };
})();