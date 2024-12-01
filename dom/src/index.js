import './css/style.css';
import Game from './js/game.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    new Game();
  } catch (e) {
    console.error('Failed to initialize game:', e);
  }
});