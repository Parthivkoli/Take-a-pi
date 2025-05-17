/**
 * Spiral Visualization Module
 * Generates a spiral pattern based on Pi digits with particle effects
 */

const SpiralVisualization = (function() {
  // Private variables
  let sketch = null;
  let canvas = null;
  let digits = [];
  let particles = [];
  let angleOffset = 0;
  
  // Color palette for digits 0-9 (same as grid for consistency)
  const colorPalette = [
    [41, 98, 255],   // 0: Blue
    [93, 58, 252],   // 1: Purple
    [152, 68, 248],  // 2: Violet
    [211, 79, 244],  // 3: Magenta
    [255, 89, 230],  // 4: Pink
    [255, 99, 177],  // 5: Rose
    [255, 109, 124], // 6: Coral
    [255, 119, 71],  // 7: Orange
    [235, 129, 27],  // 8: Amber
    [200, 139, 0]    // 9: Gold
  ];
  
  // Initialize the visualization
  function init(container, piDigits) {
    digits = piDigits.getAllDigits();
    
    // Define the p5.js sketch
    sketch = (p) => {
      let center = { x: 0, y: 0 };
      let spiralScale = 0;
      
      p.setup = () => {
        // Create canvas to fit container with 1:1 aspect ratio
        const size = Math.min(container.offsetWidth, container.offsetHeight);
        canvas = p.createCanvas(size, size);
        canvas.parent(container);
        
        // Initialize variables
        center = { x: p.width / 2, y: p.height / 2 };
        spiralScale = p.width / 300;
        
        // Create initial particles
        createParticles();
        
        p.frameRate(30);
        p.textAlign(p.CENTER, p.CENTER);
        p.textFont('Poppins');
        p.smooth();
      };
      
      p.draw = () => {
        p.background(10, 13, 28, 20); // Semi-transparent background for trails
        
        // Apply glow effect
        p.drawingContext.shadowBlur = 10;
        p.drawingContext.shadowColor = 'rgba(100, 100, 255, 0.3)';
        
        // Rotate the entire spiral slowly
        angleOffset += 0.002;
        
        // Draw spiral
        drawSpiral();
        
        // Update and draw particles
        updateParticles();
      };
      
      p.windowResized = () => {
        // Responsive canvas resize
        const size = Math.min(container.offsetWidth, container.offsetHeight);
        p.resizeCanvas(size, size);
        center = { x: p.width / 2, y: p.height / 2 };
        spiralScale = p.width / 300;
        
        // Reset particles for new size
        particles = [];
        createParticles();
      };
      
      // Create particles based on pi digits
      function createParticles() {
        particles = [];
        
        // Only use first 500 digits for performance
        const digitsToUse = Math.min(digits.length, 500);
        
        for (let i = 0; i < digitsToUse; i++) {
          const digit = parseInt(digits[i]);
          const angle = (i * 0.5) + digit * 0.2; // Each digit affects angle
          const radius = p.sqrt(i) * spiralScale * (1 + digit * 0.1);
          
          // Calculate position
          const x = center.x + p.cos(angle) * radius;
          const y = center.y + p.sin(angle) * radius;
          
          // Create particle
          particles.push({
            x: x,
            y: y,
            originX: x,
            originY: y,
            radius: 2 + digit * 0.6,
            color: colorPalette[digit],
            angle: angle,
            baseRadius: radius,
            speed: 0.01 + (digit * 0.002),
            digit: digit,
            oscillation: 0,
            oscillationSpeed: 0.05 + (digit * 0.01)
          });
        }
      }
      
      // Draw the spiral of pi digits
      function drawSpiral() {
        p.noFill();
        p.stroke(90, 120, 220, 40);
        p.strokeWeight(1);
        
        p.beginShape();
        for (let i = 0; i < Math.min(digits.length, 1000); i += 2) {
          const digit = parseInt(digits[i]);
          const angle = (i * 0.5) + digit * 0.2 + angleOffset;
          const radius = p.sqrt(i) * spiralScale;
          
          const x = center.x + p.cos(angle) * radius;
          const y = center.y + p.sin(angle) * radius;
          
          p.vertex(x, y);
        }
        p.endShape();
      }
      
      // Update and draw particles
      function updateParticles() {
        for (let i = 0; i < particles.length; i++) {
          const particle = particles[i];
          
          // Update oscillation
          particle.oscillation += particle.oscillationSpeed;
          
          // Apply oscillation to position
          const oscillationAmount = p.sin(particle.oscillation) * (3 + particle.digit);
          const newAngle = particle.angle + angleOffset;
          
          particle.x = particle.originX + p.cos(newAngle + p.PI/2) * oscillationAmount;
          particle.y = particle.originY + p.sin(newAngle + p.PI/2) * oscillationAmount;
          
          // Draw particle
          p.noStroke();
          const [r, g, b] = particle.color;
          p.fill(r, g, b, 220);
          p.circle(particle.x, particle.y, particle.radius * 2);
          
          // Draw digit at certain intervals
          if (i % 20 === 0) {
            p.fill(255, 200);
            p.textSize(10 + particle.digit);
            p.text(particle.digit, particle.x, particle.y);
          }
        }
      }
    };
    
    // Create new p5 instance
    new p5(sketch);
    
    return {
      update: updateDigits,
      resize: resizeCanvas,
      destroy: destroyCanvas
    };
  }
  
  // Update the digits being visualized
  function updateDigits(piDigits) {
    digits = piDigits.getAllDigits();
    
    // Recreate particles with new digits
    if (sketch && sketch.createParticles) {
      sketch.createParticles();
    }
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