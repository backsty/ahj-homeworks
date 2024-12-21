import '../css/style.css';
import GamePlay from './gamePlay.js';

const boardEl = document.getElementById('board');
const modalEl = document.getElementById('modal');
const deadEl = document.getElementById('dead');
const lostEl = document.getElementById('lost');

if (!boardEl || !modalEl || !deadEl || !lostEl) {
  throw new Error('One or more elements are not defined in app.js');
}

const gamePlay = new GamePlay(boardEl, modalEl, deadEl, lostEl);
gamePlay.startGame();