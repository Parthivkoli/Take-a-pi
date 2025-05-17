/**
 * Grid Visualization Module
 * Displays Pi digits in a colorful grid with pulsating animations
 */

const GridVisualization = (function() {
  // Private variables
  let sketch = null;
  let canvas = null;
  let digits = [];
  let gridSize = 25; // Number of cells across
  let cellSize = 24;
  let animationFrames = 60;
  let pulsatingCells = [];
  
  // Color palette for digits 0-9
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
      let lastUpdateTime = 0;
      const updateInterval = 2000; // Add new pulsating cells every 2 seconds
      
      p.setup = () => {
        // Create canvas to fit container with 1:1 aspect ratio
        const size = Math.min(container.offsetWidth, container.offsetHeight);
        canvas = p.createCanvas(size, size);
        canvas.parent(container);
        
        // Calculate cell size based on canvas dimensions
        cellSize = size / gridSize;
        
        // Initial pulsating cells
        addRandomPulsatingCells(5);
        
        p.frameRate(30);
        p.textAlign(p.CENTER, p.CENTER);
        p.textFont('Poppins');
      };
      
      p.draw = () => {
        p.background(10, 13, 28);
        
        // Draw grid
        drawGrid();
        
        // Update pulsating cells
        updatePulsatingCells();
        
        // Add new pulsating cells periodically
        if (p.millis() - lastUpdateTime > updateInterval) {
          addRandomPulsatingCells(2);
          lastUpdateTime = p.millis();
        }
      };
      
      p.windowResized = () => {
        // Responsive canvas resize
        const size = Math.min(container.offsetWidth, container.offsetHeight);
        p.resizeCanvas(size, size);
        cellSize = size / gridSize;
      };
      
      // Draw the grid with Pi digits
      function drawGrid() {
        for (let y = 0; y < gridSize; y++) {
          for (let x = 0; x < gridSize; x++) {
            const index = y * gridSize + x;
            
            if (index < digits.length) {
              const digit = parseInt(digits[index]);
              const baseColor = colorPalette[digit];
              let cellAlpha = 100; // Default alpha for cells
              let scale = 1;
              
              // Check if this cell is pulsating
              const pulsatingCell = pulsatingCells.find(cell => cell.x === x && cell.y === y);
              if (pulsatingCell) {
                cellAlpha = p.map(pulsatingCell.frame, 0, animationFrames, 255, 100);
                scale = p.map(pulsatingCell.frame, 0, animationFrames, 1.2, 1);
              }
              
              // Draw cell background
              p.push();
              p.translate(x * cellSize + cellSize/2, y * cellSize + cellSize/2);
              p.noStroke();
              p.fill(baseColor[0], baseColor[1], baseColor[2], cellAlpha);
              const scaledSize = cellSize * scale;
              p.rect(-scaledSize/2, -scaledSize/2, scaledSize, scaledSize, scaledSize * 0.2);
              
              // Draw digit
              p.fill(255, p.map(cellAlpha, 100, 255, 180, 255));
              p.textSize(cellSize * 0.5);
              p.text(digit, 0, 0);
              p.pop();
            }
          }
        }
      }
      
      // Add random pulsating cells
      function addRandomPulsatingCells(count) {
        for (let i = 0; i < count; i++) {
          if (digits.length > 0) {
            const x = Math.floor(p.random(gridSize));
            const y = Math.floor(p.random(gridSize));
            
            // Check if the coordinate is already pulsating
            const existing = pulsatingCells.find(cell => cell.x === x && cell.y === y);
            
            if (!existing && y * gridSize + x < digits.length) {
              pulsatingCells.push({
                x: x,
                y: y,
                frame: 0
              });
            }
          }
        }
      }
      
      // Update pulsating cells animation
      function updatePulsatingCells() {
        for (let i = pulsatingCells.length - 1; i >= 0; i--) {
          pulsatingCells[i].frame++;
          
          // Remove completed animations
          if (pulsatingCells[i].frame > animationFrames) {
            pulsatingCells.splice(i, 1);
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
    pulsatingCells = []; // Reset pulsations
    
    // Add initial pulsating cells
    if (sketch) {
      sketch.addRandomPulsatingCells?.(5);
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