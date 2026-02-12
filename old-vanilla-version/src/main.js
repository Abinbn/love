import { initStarrySky } from './three/starrySky.js';
import { initWishSystem } from './wishes/wishSystem.js';
import { setupEventListeners } from './ui/events.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    initStarrySky();
    initWishSystem();
    setupEventListeners();
  } catch (error) {
    console.error('Initialization error:', error);
  }
});

// Handle errors globally
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});