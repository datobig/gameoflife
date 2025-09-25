require('@testing-library/jest-dom');

// Polyfill for TextEncoder/TextDecoder
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Font Awesome
global.FontAwesome = {
  fas: {
    faSquare: 'fa-square',
    faPlay: 'fa-play',
    faPause: 'fa-pause',
    faRedo: 'fa-redo',
    faDice: 'fa-dice',
    faExpandAlt: 'fa-expand-alt',
    faSyncAlt: 'fa-sync-alt',
    faTachometerAlt: 'fa-tachometer-alt',
    faInfoCircle: 'fa-info-circle',
    faChartLine: 'fa-chart-line'
  }
};

// Mock performance.now
global.performance = {
  now: jest.fn(() => Date.now())
};

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = jest.fn((callback) => {
  return setTimeout(callback, 16);
});

global.cancelAnimationFrame = jest.fn((id) => {
  clearTimeout(id);
});
