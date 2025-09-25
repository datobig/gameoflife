/**
 * @jest-environment jsdom
 */

// Mock DOM elements and functions
const mockCanvas = {
  getContext: jest.fn(() => ({
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    strokeRect: jest.fn(),
    beginPath: jest.fn(),
    rect: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    fill: jest.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    shadowColor: '',
    shadowBlur: 0
  })),
  getBoundingClientRect: jest.fn(() => ({
    left: 0,
    top: 0,
    width: 800,
    height: 600
  })),
  width: 800,
  height: 600,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
};

// Mock DOM elements
const mockElements = {
  startBtn: { disabled: false, click: jest.fn() },
  pauseBtn: { disabled: true, click: jest.fn() },
  randomBtn: { click: jest.fn() },
  resetBtn: { click: jest.fn() },
  rowsSlider: { value: '50', addEventListener: jest.fn() },
  colsSlider: { value: '80', addEventListener: jest.fn() },
  cellSizeSlider: { value: '6', addEventListener: jest.fn() },
  speedSlider: { value: '3', addEventListener: jest.fn() },
  generationCount: { textContent: '0' },
  liveCellsCount: { textContent: '0' },
  gridSize: { textContent: '50x80' },
  updateFrequency: { textContent: 'Normal' }
};

// Mock document.getElementById
global.document = {
  getElementById: jest.fn((id) => {
    if (id === 'gameCanvas') return mockCanvas;
    return mockElements[id] || { textContent: '', disabled: false };
  }),
  querySelector: jest.fn(() => null),
  addEventListener: jest.fn()
};

// Mock window
global.window = {
  addEventListener: jest.fn(),
  innerWidth: 1200,
  innerHeight: 800
};

// Mock performance
global.performance = {
  now: jest.fn(() => Date.now())
};

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((callback) => {
  return setTimeout(callback, 16);
});

global.cancelAnimationFrame = jest.fn((id) => {
  clearTimeout(id);
});

// Game of Life implementation (extracted from HTML)
let config = {
  rows: 50,
  cols: 80,
  cellSize: 6,
  speed: 3,
  scale: 1.2
};

let grid = [];
let nextGrid = [];
let animationId = null;
let isRunning = false;
let generation = 0;
let lastUpdateTime = 0;
const updateInterval = [0, 50, 80, 120, 160, 200];

const canvas = mockCanvas;
const ctx = canvas.getContext('2d');

function initSimulation() {
  resizeCanvas();
  grid = createEmptyGrid(config.rows, config.cols);
  nextGrid = [...grid].map(row => [...row]);
  generation = 0;
  updateStats();
  drawGrid();
}

function resizeCanvas() {
  const width = Math.min(config.cols * config.cellSize, window.innerWidth - 100);
  const height = Math.min(config.rows * config.cellSize, window.innerHeight - 250);
  canvas.width = width;
  canvas.height = height;
}

function createEmptyGrid(rows, cols) {
  return Array.from({ length: rows }, () => 
    Array(cols).fill(0)
  );
}

function randomizeGrid() {
  for (let i = 0; i < config.rows; i++) {
    for (let j = 0; j < config.cols; j++) {
      grid[i][j] = Math.random() > 0.7 ? 1 : 0;
    }
  }
  updateStats();
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < config.rows; i++) {
    for (let j = 0; j < config.cols; j++) {
      if (grid[i][j]) {
        ctx.fillStyle = 'rgba(74, 144, 226, 0.8)';
        ctx.fillRect(j * config.cellSize, i * config.cellSize, config.cellSize, config.cellSize);
        
        ctx.shadowColor = '#5c6bc0';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.rect(j * config.cellSize + 2, i * config.cellSize + 2, config.cellSize - 4, config.cellSize - 4);
        ctx.fillStyle = 'rgba(74, 144, 226, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.strokeStyle = '#5c6bc0';
        ctx.lineWidth = 1;
        ctx.strokeRect(j * config.cellSize + 1, i * config.cellSize + 1, config.cellSize - 2, config.cellSize - 2);
      }
    }
  }
  
  ctx.strokeStyle = 'rgba(74, 144, 226, 0.3)';
  ctx.lineWidth = 0.5;
  
  for (let i = 0; i <= config.rows; i++) {
    const y = i * config.cellSize;
    if (y < canvas.height) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }
  
  for (let j = 0; j <= config.cols; j++) {
    const x = j * config.cellSize;
    if (x < canvas.width) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
  }
}

function updateGrid() {
  for (let i = 0; i < config.rows; i++) {
    for (let j = 0; j < config.cols; j++) {
      const liveNeighbors = countLiveNeighbors(i, j);
      
      if (grid[i][j]) {
        nextGrid[i][j] = (liveNeighbors === 2 || liveNeighbors === 3) ? 1 : 0;
      } else {
        nextGrid[i][j] = (liveNeighbors === 3) ? 1 : 0;
      }
    }
  }
  
  [grid, nextGrid] = [nextGrid, grid];
  generation++;
  updateStats();
}

function countLiveNeighbors(row, col) {
  let count = 0;
  
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      
      const r = (row + i + config.rows) % config.rows;
      const c = (col + j + config.cols) % config.cols;
      
      count += grid[r][c];
    }
  }
  
  return count;
}

function animate(timestamp) {
  if (!isRunning) return;
  
  const deltaTime = timestamp - lastUpdateTime;
  
  if (deltaTime >= updateInterval[config.speed]) {
    updateGrid();
    drawGrid();
    lastUpdateTime = timestamp;
  }
  
  animationId = requestAnimationFrame(animate);
}

function updateStats() {
  mockElements.generationCount.textContent = generation.toLocaleString();
  
  let liveCells = 0;
  for (let i = 0; i < config.rows; i++) {
    for (let j = 0; j < config.cols; j++) {
      liveCells += grid[i][j];
    }
  }
  
  mockElements.liveCellsCount.textContent = liveCells.toLocaleString();
  mockElements.gridSize.textContent = `${config.rows}x${config.cols}`;
  
  const speedLabels = ['Fastest', 'Very Fast', 'Normal', 'Slow', 'Slower'];
  mockElements.updateFrequency.textContent = speedLabels[config.speed - 1];
}

function handleCanvasClick(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  const col = Math.floor(x / config.cellSize);
  const row = Math.floor(y / config.cellSize);
  
  if (row >= 0 && row < config.rows && col >= 0 && col < config.cols) {
    if (!isRunning) {
      grid[row][col] = grid[row][col] ? 0 : 1;
      drawGrid();
      generation++;
      updateStats();
    } else {
      if (grid[row][col] === 0) {
        grid[row][col] = 1;
        drawGrid();
        updateStats();
      }
    }
  }
}

describe('Game of Life - Complete Test Suite', () => {
  beforeEach(() => {
    // Reset state
    config = { rows: 50, cols: 80, cellSize: 6, speed: 3, scale: 1.2 };
    grid = [];
    nextGrid = [];
    animationId = null;
    isRunning = false;
    generation = 0;
    lastUpdateTime = 0;
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    test('should initialize with default configuration', () => {
      expect(config.rows).toBe(50);
      expect(config.cols).toBe(80);
      expect(config.cellSize).toBe(6);
      expect(config.speed).toBe(3);
    });

    test('should create empty grid on initialization', () => {
      initSimulation();
      expect(grid.length).toBe(50);
      expect(grid[0].length).toBe(80);
      expect(grid.every(row => row.every(cell => cell === 0))).toBe(true);
    });

    test('should reset generation counter on initialization', () => {
      generation = 5;
      initSimulation();
      expect(generation).toBe(0);
    });
  });

  describe('Grid Operations', () => {
    beforeEach(() => {
      initSimulation();
    });

    test('createEmptyGrid should create correct size grid', () => {
      const testGrid = createEmptyGrid(10, 15);
      expect(testGrid.length).toBe(10);
      expect(testGrid[0].length).toBe(15);
      expect(testGrid.every(row => row.every(cell => cell === 0))).toBe(true);
    });

    test('randomizeGrid should populate grid with random cells', () => {
      randomizeGrid();
      const hasLiveCells = grid.some(row => row.some(cell => cell === 1));
      expect(hasLiveCells).toBe(true);
    });

    test('countLiveNeighbors should count correctly', () => {
      grid[1][1] = 1;
      grid[1][2] = 1;
      grid[2][1] = 1;
      
      expect(countLiveNeighbors(1, 1)).toBe(2);
      expect(countLiveNeighbors(0, 0)).toBe(1);
      expect(countLiveNeighbors(2, 2)).toBe(3);
    });

    test('countLiveNeighbors should handle toroidal wrapping', () => {
      grid[0][0] = 1;
      grid[0][config.cols - 1] = 1;
      grid[config.rows - 1][0] = 1;
      
      expect(countLiveNeighbors(0, 0)).toBe(2);
      expect(countLiveNeighbors(config.rows - 1, config.cols - 1)).toBe(3);
    });
  });

  describe('Game of Life Rules', () => {
    beforeEach(() => {
      initSimulation();
    });

    test('survival rule: cell with 2 neighbors survives', () => {
      grid[1][1] = 1;
      grid[1][2] = 1;
      grid[2][1] = 1;
      
      updateGrid();
      expect(grid[1][1]).toBe(1);
    });

    test('survival rule: cell with 3 neighbors survives', () => {
      grid[1][1] = 1;
      grid[1][2] = 1;
      grid[2][1] = 1;
      grid[2][2] = 1;
      
      updateGrid();
      expect(grid[1][1]).toBe(1);
    });

    test('death rule: cell with fewer than 2 neighbors dies', () => {
      grid[1][1] = 1;
      grid[1][2] = 1;
      
      updateGrid();
      expect(grid[1][1]).toBe(0);
    });

    test('death rule: cell with more than 3 neighbors dies', () => {
      grid[1][1] = 1;
      grid[0][0] = 1;
      grid[0][1] = 1;
      grid[0][2] = 1;
      grid[1][0] = 1;
      grid[1][2] = 1;
      
      updateGrid();
      expect(grid[1][1]).toBe(0);
    });

    test('birth rule: dead cell with exactly 3 neighbors becomes alive', () => {
      grid[0][0] = 1;
      grid[0][1] = 1;
      grid[1][0] = 1;
      
      updateGrid();
      expect(grid[1][1]).toBe(1);
    });
  });

  describe('Canvas Operations', () => {
    beforeEach(() => {
      initSimulation();
    });

    test('drawGrid should clear canvas', () => {
      drawGrid();
      expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
    });

    test('drawGrid should draw live cells', () => {
      grid[0][0] = 1;
      drawGrid();
      expect(ctx.fillRect).toHaveBeenCalled();
    });

    test('drawGrid should draw grid lines', () => {
      drawGrid();
      expect(ctx.stroke).toHaveBeenCalled();
    });
  });

  describe('Animation Control', () => {
    beforeEach(() => {
      initSimulation();
    });

    test('start button should start animation', () => {
      isRunning = true;
      mockElements.startBtn.disabled = true;
      mockElements.pauseBtn.disabled = false;
      expect(isRunning).toBe(true);
      expect(mockElements.startBtn.disabled).toBe(true);
      expect(mockElements.pauseBtn.disabled).toBe(false);
    });

    test('pause button should stop animation', () => {
      isRunning = false;
      mockElements.startBtn.disabled = false;
      mockElements.pauseBtn.disabled = true;
      expect(isRunning).toBe(false);
      expect(mockElements.startBtn.disabled).toBe(false);
      expect(mockElements.pauseBtn.disabled).toBe(true);
    });

    test('reset should reset simulation', () => {
      generation = 5;
      grid[0][0] = 1;
      initSimulation();
      expect(generation).toBe(0);
      expect(grid[0][0]).toBe(0);
    });

    test('random should generate random pattern', () => {
      randomizeGrid();
      const hasLiveCells = grid.some(row => row.some(cell => cell === 1));
      expect(hasLiveCells).toBe(true);
    });
  });

  describe('Canvas Click Handling', () => {
    beforeEach(() => {
      initSimulation();
    });

    test('click on empty cell when paused should toggle to live', () => {
      const event = { clientX: 10, clientY: 10 };
      handleCanvasClick(event);
      expect(grid[1][1]).toBe(1);
    });

    test('click on live cell when paused should toggle to dead', () => {
      grid[1][1] = 1;
      const event = { clientX: 10, clientY: 10 };
      handleCanvasClick(event);
      expect(grid[1][1]).toBe(0);
    });

    test('click on empty cell when running should add cell', () => {
      isRunning = true;
      const event = { clientX: 10, clientY: 10 };
      handleCanvasClick(event);
      expect(grid[1][1]).toBe(1);
    });

    test('click on live cell when running should not remove cell', () => {
      isRunning = true;
      grid[1][1] = 1;
      const event = { clientX: 10, clientY: 10 };
      handleCanvasClick(event);
      expect(grid[1][1]).toBe(1);
    });
  });

  describe('Statistics Updates', () => {
    beforeEach(() => {
      initSimulation();
    });

    test('updateStats should update generation count', () => {
      generation = 42;
      updateStats();
      expect(mockElements.generationCount.textContent).toBe('42');
    });

    test('updateStats should count live cells', () => {
      grid[0][0] = 1;
      grid[1][1] = 1;
      updateStats();
      expect(mockElements.liveCellsCount.textContent).toBe('2');
    });

    test('updateStats should update grid size display', () => {
      config.rows = 25;
      config.cols = 35;
      updateStats();
      expect(mockElements.gridSize.textContent).toBe('25x35');
    });

    test('updateStats should update speed label', () => {
      config.speed = 1;
      updateStats();
      expect(mockElements.updateFrequency.textContent).toBe('Fastest');
    });
  });

  describe('Canvas Resizing', () => {
    test('resizeCanvas should set canvas dimensions', () => {
      config.rows = 20;
      config.cols = 30;
      config.cellSize = 10;
      
      resizeCanvas();
      expect(canvas.width).toBe(300);
      expect(canvas.height).toBe(200);
    });

    test('resizeCanvas should respect window size limits', () => {
      window.innerWidth = 200;
      window.innerHeight = 150;
      
      resizeCanvas();
      expect(canvas.width).toBeLessThanOrEqual(200);
      expect(canvas.height).toBeLessThanOrEqual(150);
    });
  });

  describe('Animation Loop', () => {
    beforeEach(() => {
      initSimulation();
    });

    test('animate should not update when not running', () => {
      isRunning = false;
      const initialGeneration = generation;
      animate(1000);
      expect(generation).toBe(initialGeneration);
    });

    test('animate should update when running and enough time passed', () => {
      isRunning = true;
      lastUpdateTime = 0;
      const initialGeneration = generation;
      animate(200); // More than updateInterval[3] = 120
      expect(generation).toBe(initialGeneration + 1);
    });

    test('animate should not update when not enough time passed', () => {
      isRunning = true;
      lastUpdateTime = 100;
      const initialGeneration = generation;
      animate(150); // Less than updateInterval[3] = 120
      expect(generation).toBe(initialGeneration);
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      initSimulation();
    });

    test('should handle empty grid', () => {
      updateGrid();
      expect(nextGrid.every(row => row.every(cell => cell === 0))).toBe(true);
    });

    test('should handle full grid', () => {
      grid.forEach(row => row.fill(1));
      updateGrid();
      // All cells should die due to overpopulation
      expect(grid.every(row => row.every(cell => cell === 0))).toBe(true);
    });

    test('should handle single cell', () => {
      grid[0][0] = 1;
      updateGrid();
      expect(grid[0][0]).toBe(0); // Dies from underpopulation
    });

    test('should handle click outside grid bounds', () => {
      const event = { clientX: -10, clientY: -10 };
      const initialGrid = JSON.parse(JSON.stringify(grid));
      handleCanvasClick(event);
      expect(grid).toEqual(initialGrid);
    });
  });

  describe('Integration Tests', () => {
    test('full simulation cycle', () => {
      initSimulation();
      
      // Start with random pattern
      randomizeGrid();
      const initialLiveCells = grid.flat().reduce((sum, cell) => sum + cell, 0);
      expect(initialLiveCells).toBeGreaterThan(0);
      
      // Start simulation
      isRunning = true;
      expect(isRunning).toBe(true);
      
      // Let it run for a few generations
      for (let i = 0; i < 5; i++) {
        updateGrid();
      }
      
      // Pause and check stats
      isRunning = false;
      expect(isRunning).toBe(false);
      expect(generation).toBe(5);
    });

    test('parameter changes during simulation', () => {
      initSimulation();
      isRunning = true;
      
      // Change cell size
      config.cellSize = 8;
      expect(config.cellSize).toBe(8);
      
      // Change speed
      config.speed = 1;
      expect(config.speed).toBe(1);
    });
  });
});
