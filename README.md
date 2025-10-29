### Conway's Game of Life — Interactive Web Simulation

A modern, self-contained implementation of Conway's Game of Life in a single HTML file (`golife.html`). Includes a responsive UI, controls for grid size, cell size, and update speed, plus real‑time statistics.

---

### Getting Started
- **Requirements**: A modern browser (Chrome, Edge, Firefox, Safari). No build or server needed.
- **Run**:
  1. Open `golife.html` directly in your browser (double‑click or drag‑and‑drop into the browser window).
  2. Click "Start" to begin the simulation.

---

### UI and Controls
- **Canvas**: Displays the grid. When paused, click to toggle a cell between dead/alive. When running, click to add live cells.
- **Main Buttons**:
  - **Start**: Starts the simulation and animation.
  - **Pause**: Pauses the simulation (enables manual editing via canvas clicks).
  - **Step**: Advances exactly one generation (perfect for analyzing patterns step-by-step).
  - **Random Start**: Generates a random pattern on the grid.
  - **Reset Grid**: Clears the grid and resets the generation counter.
- **Pattern Controls**:
  - **Pattern Selector**: Dropdown menu with 10 famous Conway patterns (Glider, LWSS, Pulsar, Gosper Glider Gun, Blinker, Toad, Beacon, Pentadecathlon, Block, Beehive).
  - **Place Pattern**: Places the selected pattern at the center of the grid.
- **Save/Load**:
  - **Save Pattern**: Exports the current grid state as a JSON file for sharing or later use.
  - **Load Pattern**: Imports a previously saved pattern from a JSON file.
- **Sliders**:
  - **Rows**: Number of grid rows (20–100).
  - **Columns**: Number of grid columns (20–100).
  - **Cell Size**: Pixel size per cell (2–15 px).
  - **Speed**: Update speed (1–5) with labels: Fastest, Very Fast, Normal, Slow, Slower.
- **Advanced Options**:
  - **Edge Behavior**: Toggle between toroidal (wrap-around) and fixed edges.
  - **Color by Cell Age**: Toggle gradient coloring showing cell age: young (cyan) → mature (blue) → old (purple).
- **Stats**:
  - **Generation**: Number of simulated generations.
  - **Live Cells**: Count of live cells in the current generation.
  - **Grid Size**: Current size (rows × columns).
  - **Update Frequency**: Human‑readable speed label based on the selected speed.

---

### Rules (Conway)
- **Survival**: A live cell with 2 or 3 neighbors survives.
- **Death (underpopulation)**: A live cell with fewer than 2 neighbors dies.
- **Death (overpopulation)**: A live cell with more than 3 neighbors dies.
- **Birth**: A dead cell with exactly 3 neighbors becomes alive.

---

### Technical Details
- **Single file**: All logic, styles, and markup live in `golife.html`.
- **Rendering**: HTML5 `<canvas>` 2D context. Live cells are filled rectangles with a subtle glow and thin outline.
- **Grid**: Two 2D arrays (`grid` and `nextGrid`) are swapped between generations for efficient updates.
- **Cell Age Tracking**: Two additional arrays (`cellAges` and `nextCellAges`) track how many generations each cell has been alive.
- **Edges**: Configurable boundary conditions - toroidal (wrap‑around) or fixed (edges are dead cells). Neighbor lookups adapt based on the `toroidalEdges` setting.
- **Speed**: `Speed` 1–5 maps to millisecond intervals via `updateInterval`. Animation runs with `requestAnimationFrame` gated by elapsed time since last update.
- **Pattern Library**: 10 preset patterns stored as coordinate arrays for easy placement.
- **Save/Load**: Grid state serialized to JSON with metadata (dimensions, generation count, timestamp).
- **Responsive size**: Canvas dimensions derive from `rows × cols × cellSize`, capped to the viewport to avoid overflow.
- **Interaction**: Canvas clicks convert to `row/col` using `clientX/Y` relative to the canvas rect and current `cellSize`.
- **Statistics**: Recomputed each update (live cell count, generation counter, speed labels).
- **Dependencies**: Font Awesome via CDN for icons only.

---

### Common Workflows
- **Draw custom patterns**:
  1. Click "Pause" or don't start the simulation yet.
  2. Click on the canvas to toggle cells.
  3. Click "Start" to watch the evolution.

- **Use preset patterns**:
  1. Select a pattern from the dropdown (e.g., "Glider", "Pulsar").
  2. Click "Place Pattern" to add it to the center of the grid.
  3. Click "Start" to watch it evolve.

- **Step through generations**:
  1. Set up your pattern (draw manually or use presets).
  2. Click "Step" repeatedly to advance one generation at a time.
  3. Perfect for analyzing exactly how patterns evolve.

- **Explore boundary conditions**:
  1. Try a glider or spaceship pattern.
  2. Toggle "Toroidal (Wrap Around)" on/off to see how it behaves at edges.
  3. With toroidal: patterns wrap around. Without: edges act as walls.

- **Visualize cell age**:
  1. Start any simulation.
  2. Enable "Color by Cell Age" checkbox.
  3. Watch colors change: cyan (young) → blue (mature) → purple (old/stable).
  4. Great for identifying still lifes and oscillators!

- **Save and share patterns**:
  1. Create an interesting pattern.
  2. Click "Save Pattern" to download as JSON.
  3. Share the file with others or save for later.
  4. Click "Load Pattern" to import saved patterns.

- **Change grid size**:
  - Adjust "Rows" and/or "Columns". The simulation re‑initializes with the new size and resets generation.

- **Adjust cell size**:
  - Change "Cell Size" for more or less visual detail. The canvas redraws immediately.

- **Fine‑tune speed**:
  - Change "Speed". The label updates immediately; actual update timing affects the next animation steps.

---

### Performance & Quality Notes
- Smaller cell size and larger grids increase draw operations. Tune `Cell Size` or grid dimensions as needed.
- Wrap‑around edges create lively patterns but mean edges are not absorbing boundaries.
- Live cell counting is performed each update for stats; very large grids may see a minor impact.

---

### New Features (Recently Added!)
- ✅ **Step Mode**: Advance exactly one generation at a time for detailed analysis
- ✅ **Preset Patterns Library**: 10 famous Conway patterns ready to use
- ✅ **Save/Load System**: Export and import patterns as JSON files
- ✅ **Alternative Boundary Conditions**: Toggle between toroidal and fixed edges
- ✅ **Cell Age Coloring**: Visual gradient showing how long cells have been alive

### Future Enhancement Ideas
- Pattern detection and auto-labeling (identify gliders, oscillators, still lifes)
- Export animations to GIF or video
- Touch/drag drawing for mobile devices
- Zoom and pan controls for large grids
- Pattern history with undo/redo functionality
- Multiple simulation rules (not just Conway's original rules)
- Custom color themes and visual styles

---

### Troubleshooting
- Canvas clicks do nothing: Ensure the simulation is paused; manual edits are intentionally disabled while running.
- Grid appears clipped: Increase the window size or reduce `Cell Size`/grid dimensions.
- Slow on mobile: Reduce `Rows/Columns` or `Cell Size`.

---

---

### Testing

This project includes a comprehensive test suite with 38 tests covering 100% of the Game of Life functionality.

#### Test Setup
```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

#### Test Coverage
The test suite covers:
- **Initialization**: Default configuration, grid creation, generation reset
- **Grid Operations**: Empty grid creation, random population, neighbor counting with toroidal wrapping
- **Game of Life Rules**: All Conway rules (survival, death, birth) with various neighbor counts
- **Canvas Operations**: Drawing, clearing, grid lines, live cell rendering
- **Animation Control**: Start, pause, reset, random pattern generation
- **User Interaction**: Canvas clicks (paused/running modes), cell toggling, live cell injection
- **Statistics**: Generation counting, live cell counting, UI updates
- **Canvas Resizing**: Dynamic sizing, viewport constraints
- **Animation Loop**: Timing control, frame skipping, performance
- **Edge Cases**: Empty grids, full grids, single cells, boundary conditions
- **Integration**: Full simulation cycles, parameter changes during runtime

#### Test Structure
- **`golife-functions.test.js`**: Main test file with isolated function testing
- **`jest.setup.js`**: Test environment configuration and mocks
- **`package.json`**: Jest configuration and test scripts

#### Mocking
The tests use comprehensive mocking for:
- Canvas 2D context and drawing operations
- DOM elements and event handling
- Performance timing (`requestAnimationFrame`, `performance.now`)
- Browser APIs (TextEncoder, TextDecoder)

#### Running Specific Tests
```bash
# Run only initialization tests
npx jest --testNamePattern="Initialization"

# Run only Game of Life rules tests
npx jest --testNamePattern="Game of Life Rules"

# Run with verbose output
npx jest --verbose
```

---

### Development

#### Project Structure
```
gameoflife/
├── golife.html              # Main application (single file)
├── golife-functions.test.js # Comprehensive test suite
├── jest.setup.js           # Test environment setup
├── package.json            # Dependencies and scripts
└── README.md              # This documentation
```

#### Adding Features
When adding new features:
1. Update the main `golife.html` file
2. Add corresponding tests in `golife-functions.test.js`
3. Ensure all tests pass: `npm test`
4. Update this README if needed

#### Code Quality
- All functions are tested with Jest
- Canvas operations are mocked for reliable testing
- Edge cases and error conditions are covered
- Performance considerations are tested

#### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Canvas 2D context support required
- ES6+ features used (no polyfills included)

---

### License
This is a demo page only. Feel free to use for learning and experimentation.


