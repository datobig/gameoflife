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
- **Canvas**: Displays the grid. When paused, click to toggle a cell between dead/alive.
- **Buttons**:
  - Start: Starts the simulation and animation.
  - Pause: Pauses the simulation (enables manual editing via canvas clicks).
  - Reset Grid: Clears the grid and resets the generation counter.
- **Sliders**:
  - Rows: Number of grid rows (20–100).
  - Columns: Number of grid columns (20–100).
  - Cell Size: Pixel size per cell (2–15 px).
  - Speed: Update speed (1–5) with labels: Fastest, Very Fast, Normal, Slow, Slower.
- **Stats**:
  - Generation: Number of simulated generations.
  - Live Cells: Count of live cells in the current generation.
  - Grid Size: Current size (rows × columns).
  - Update Frequency: Human‑readable speed label based on the selected speed.

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
- **Edges**: Toroidal (wrap‑around) neighborhood. Neighbor lookups use modular arithmetic so patterns leaving one edge re‑enter from the opposite side.
- **Speed**: `Speed` 1–5 maps to millisecond intervals via `updateInterval`. Animation runs with `requestAnimationFrame` gated by elapsed time since last update.
- **Responsive size**: Canvas dimensions derive from `rows × cols × cellSize`, capped to the viewport to avoid overflow.
- **Interaction**: Canvas clicks convert to `row/col` using `clientX/Y` relative to the canvas rect and current `cellSize`.
- **Statistics**: Recomputed each update (live cell count, generation counter, speed labels).
- **Dependencies**: Font Awesome via CDN for icons only.

---

### Common Workflows
- **Draw custom patterns**:
  1. Click "Pause" or don’t start the simulation yet.
  2. Click on the canvas to toggle cells.
  3. Click "Start" to watch the evolution.

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

### Extensibility Ideas
- Add preset patterns (e.g., glider, pulsar) via buttons that stamp cells into the grid.
- Export/import grid state (e.g., JSON) for sharing patterns.
- Single‑step execution ("Step") to advance one generation at a time.
- Toggle boundary conditions (toroidal vs fixed edges).
- Color themes for different pattern types or cell ages.

---

### Troubleshooting
- Canvas clicks do nothing: Ensure the simulation is paused; manual edits are intentionally disabled while running.
- Grid appears clipped: Increase the window size or reduce `Cell Size`/grid dimensions.
- Slow on mobile: Reduce `Rows/Columns` or `Cell Size`.

---

### License
This is a demo page only. Feel free to use for learning and experimentation.


