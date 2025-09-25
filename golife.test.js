/**
 * @jest-environment jsdom
 */

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Load the HTML file
const html = fs.readFileSync(path.join(__dirname, 'golife.html'), 'utf8');
const dom = new JSDOM(html, {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.HTMLCanvasElement = dom.window.HTMLCanvasElement;
global.CanvasRenderingContext2D = dom.window.CanvasRenderingContext2D;

// Mock canvas methods
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

// Mock canvas element
Object.defineProperty(dom.window.HTMLCanvasElement.prototype, 'getContext', {
  value: mockCanvas.getContext
});

Object.defineProperty(dom.window.HTMLCanvasElement.prototype, 'getBoundingClientRect', {
  value: mockCanvas.getBoundingClientRect
});

// Execute the script
const script = dom.window.document.querySelector('script');
if (script) {
  const scriptContent = script.textContent;
  eval(scriptContent);
}

describe('Game of Life - Complete Test Suite', () => {
  let canvas, ctx, startBtn, pauseBtn, randomBtn, resetBtn;
  let rowsSlider, colsSlider, cellSizeSlider, speedSlider;
  let generationCount, liveCellsCount, gridSize, updateFrequency;

  beforeEach(() => {
    // Reset DOM
    dom.window.document.body.innerHTML = html;
    
    // Get elements
    canvas = dom.window.document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    startBtn = dom.window.document.getElementById('startBtn');
    pauseBtn = dom.window.document.getElementById('pauseBtn');
    randomBtn = dom.window.document.getElementById('randomBtn');
    resetBtn = dom.window.document.getElementById('resetBtn');
    
    rowsSlider = dom.window.document.getElementById('rows');
    colsSlider = dom.window.document.getElementById('cols');
    cellSizeSlider = dom.window.document.getElementById('cellSize');
    speedSlider = dom.window.document.getElementById('speed');
    
    generationCount = dom.window.document.getElementById('generationCount');
    liveCellsCount = dom.window.document.getElementById('liveCellsCount');
    gridSize = dom.window.document.getElementById('gridSize');
    updateFrequency = dom.window.document.getElementById('updateFrequency');

    // Reset global variables
    if (typeof window !== 'undefined') {
      window.grid = [];
      window.nextGrid = [];
      window.animationId = null;
      window.isRunning = false;
      window.generation = 0;
      window.lastUpdateTime = 0;
    }

    // Re-execute script
    const script = dom.window.document.querySelector('script');
    if (script) {
      eval(script.textContent);
    }
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
      // Set up a simple pattern
      grid[1][1] = 1;
      grid[1][2] = 1;
      grid[2][1] = 1;
      
      expect(countLiveNeighbors(1, 1)).toBe(2);
      expect(countLiveNeighbors(0, 0)).toBe(1);
      expect(countLiveNeighbors(2, 2)).toBe(1);
    });

    test('countLiveNeighbors should handle toroidal wrapping', () => {
      // Test edge wrapping
      grid[0][0] = 1;
      grid[0][config.cols - 1] = 1;
      grid[config.rows - 1][0] = 1;
      
      expect(countLiveNeighbors(0, 0)).toBe(2);
      expect(countLiveNeighbors(config.rows - 1, config.cols - 1)).toBe(1);
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
      expect(nextGrid[1][1]).toBe(1);
    });

    test('survival rule: cell with 3 neighbors survives', () => {
      grid[1][1] = 1;
      grid[1][2] = 1;
      grid[2][1] = 1;
      grid[2][2] = 1;
      
      updateGrid();
      expect(nextGrid[1][1]).toBe(1);
    });

    test('death rule: cell with fewer than 2 neighbors dies', () => {
      grid[1][1] = 1;
      grid[1][2] = 1;
      
      updateGrid();
      expect(nextGrid[1][1]).toBe(0);
    });

    test('death rule: cell with more than 3 neighbors dies', () => {
      grid[1][1] = 1;
      grid[0][0] = 1;
      grid[0][1] = 1;
      grid[0][2] = 1;
      grid[1][0] = 1;
      grid[1][2] = 1;
      
      updateGrid();
      expect(nextGrid[1][1]).toBe(0);
    });

    test('birth rule: dead cell with exactly 3 neighbors becomes alive', () => {
      grid[0][0] = 1;
      grid[0][1] = 1;
      grid[1][0] = 1;
      
      updateGrid();
      expect(nextGrid[1][1]).toBe(1);
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
      startBtn.click();
      expect(isRunning).toBe(true);
      expect(startBtn.disabled).toBe(true);
      expect(pauseBtn.disabled).toBe(false);
    });

    test('pause button should stop animation', () => {
      startBtn.click();
      pauseBtn.click();
      expect(isRunning).toBe(false);
      expect(startBtn.disabled).toBe(false);
      expect(pauseBtn.disabled).toBe(true);
    });

    test('reset button should reset simulation', () => {
      generation = 5;
      grid[0][0] = 1;
      resetBtn.click();
      expect(generation).toBe(0);
      expect(grid[0][0]).toBe(0);
    });

    test('random button should generate random pattern', () => {
      randomBtn.click();
      const hasLiveCells = grid.some(row => row.some(cell => cell === 1));
      expect(hasLiveCells).toBe(true);
    });
  });

  describe('Canvas Click Handling', () => {
    beforeEach(() => {
      initSimulation();
    });

    test('click on empty cell when paused should toggle to live', () => {
      const event = new dom.window.MouseEvent('click', {
        clientX: 10,
        clientY: 10
      });
      
      handleCanvasClick(event);
      expect(grid[1][1]).toBe(1);
    });

    test('click on live cell when paused should toggle to dead', () => {
      grid[1][1] = 1;
      const event = new dom.window.MouseEvent('click', {
        clientX: 10,
        clientY: 10
      });
      
      handleCanvasClick(event);
      expect(grid[1][1]).toBe(0);
    });

    test('click on empty cell when running should add cell', () => {
      isRunning = true;
      const event = new dom.window.MouseEvent('click', {
        clientX: 10,
        clientY: 10
      });
      
      handleCanvasClick(event);
      expect(grid[1][1]).toBe(1);
    });

    test('click on live cell when running should not remove cell', () => {
      isRunning = true;
      grid[1][1] = 1;
      const event = new dom.window.MouseEvent('click', {
        clientX: 10,
        clientY: 10
      });
      
      handleCanvasClick(event);
      expect(grid[1][1]).toBe(1);
    });
  });

  describe('Parameter Controls', () => {
    beforeEach(() => {
      initSimulation();
    });

    test('rows slider should update grid rows', () => {
      rowsSlider.value = '30';
      rowsSlider.dispatchEvent(new dom.window.Event('input'));
      expect(config.rows).toBe(30);
    });

    test('cols slider should update grid columns', () => {
      colsSlider.value = '40';
      colsSlider.dispatchEvent(new dom.window.Event('input'));
      expect(config.cols).toBe(40);
    });

    test('cell size slider should update cell size', () => {
      cellSizeSlider.value = '10';
      cellSizeSlider.dispatchEvent(new dom.window.Event('input'));
      expect(config.cellSize).toBe(10);
    });

    test('speed slider should update speed', () => {
      speedSlider.value = '5';
      speedSlider.dispatchEvent(new dom.window.Event('input'));
      expect(config.speed).toBe(5);
    });
  });

  describe('Statistics Updates', () => {
    beforeEach(() => {
      initSimulation();
    });

    test('updateStats should update generation count', () => {
      generation = 42;
      updateStats();
      expect(generationCount.textContent).toBe('42');
    });

    test('updateStats should count live cells', () => {
      grid[0][0] = 1;
      grid[1][1] = 1;
      updateStats();
      expect(liveCellsCount.textContent).toBe('2');
    });

    test('updateStats should update grid size display', () => {
      config.rows = 25;
      config.cols = 35;
      updateStats();
      expect(gridSize.textContent).toBe('25x35');
    });

    test('updateStats should update speed label', () => {
      config.speed = 1;
      updateStats();
      expect(updateFrequency.textContent).toBe('Fastest');
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
      dom.window.innerWidth = 200;
      dom.window.innerHeight = 150;
      
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
      expect(nextGrid.every(row => row.every(cell => cell === 0))).toBe(true);
    });

    test('should handle single cell', () => {
      grid[0][0] = 1;
      updateGrid();
      expect(nextGrid[0][0]).toBe(0); // Dies from underpopulation
    });

    test('should handle click outside grid bounds', () => {
      const event = new dom.window.MouseEvent('click', {
        clientX: -10,
        clientY: -10
      });
      
      const initialGrid = JSON.parse(JSON.stringify(grid));
      handleCanvasClick(event);
      expect(grid).toEqual(initialGrid);
    });
  });

  describe('Integration Tests', () => {
    test('full simulation cycle', () => {
      initSimulation();
      
      // Start with random pattern
      randomBtn.click();
      const initialLiveCells = grid.flat().reduce((sum, cell) => sum + cell, 0);
      expect(initialLiveCells).toBeGreaterThan(0);
      
      // Start simulation
      startBtn.click();
      expect(isRunning).toBe(true);
      
      // Let it run for a few generations
      for (let i = 0; i < 5; i++) {
        updateGrid();
      }
      
      // Pause and check stats
      pauseBtn.click();
      expect(isRunning).toBe(false);
      expect(generation).toBe(5);
    });

    test('parameter changes during simulation', () => {
      initSimulation();
      startBtn.click();
      
      // Change cell size
      cellSizeSlider.value = '8';
      cellSizeSlider.dispatchEvent(new dom.window.Event('input'));
      expect(config.cellSize).toBe(8);
      
      // Change speed
      speedSlider.value = '1';
      speedSlider.dispatchEvent(new dom.window.Event('input'));
      expect(config.speed).toBe(1);
    });
  });
});
