export default class Game {
  constructor() {
    this.boardSize = 4;
    this.character = null;
    this.currentPosition = null;
    this.moveInterval = null;
    this.isClicked = false;
    this.startScreen = document.querySelector('#start-screen');
    this.gameContainer = document.querySelector('#game-container');
    this.startButton = document.querySelector('#start-button');
    this.setupEventListeners();
  }

  setupEventListeners() {
    if (!this.startButton) {
      console.error('Start button not found');
      return;
    }

    this.startButton.addEventListener('click', () => {
      if (this.startScreen && this.gameContainer) {
        this.init();
        this.startScreen.classList.add('hidden');
        this.gameContainer.classList.remove('hidden');
        this.gameContainer.classList.add('active');
      }
    });
  }

  createBoard() {
    if (!this.gameContainer) {
      console.error('Game container not found');
      return;
    }

    this.gameContainer.innerHTML = '';

    const board = document.createElement('div');
    board.classList.add('game-board');

    for (let i = 0; i < this.boardSize * this.boardSize; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.index = i;
      cell.addEventListener('click', (e) => this.handleCellClick(e));
      board.appendChild(cell);
    }

    this.gameContainer.appendChild(board);
  }

  init() {
    this.createBoard();
    this.createCharacter();
    this.startGame();
  }

  createCharacter() {
    this.character = document.createElement('img');
    this.character.src = new URL('../img/goblin.png', import.meta.url);
    this.character.classList.add('character');
    this.moveToRandomCell();
  }

  handleCellClick(event) {
    const cell = event.target.closest('.cell');
    if (!cell) return;

    if (cell.contains(this.character)) {
      this.isClicked = true;
      cell.classList.add('hit');
    } else {
      cell.classList.add('miss');
      setTimeout(() => {
        cell.classList.remove('miss');
      }, 550);
    }
  }

  moveToRandomCell() {
    const cells = Array.from(document.querySelectorAll('.cell'));
    const emptyCells = cells.filter(cell => !cell.hasChildNodes());

    if (emptyCells.length === 0) return;

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const newCell = emptyCells[randomIndex];
    const oldPosition = this.currentPosition;

    if (oldPosition !== newCell) {
      if (oldPosition) {
        oldPosition.classList.remove('hit', 'miss');
      }

      if (oldPosition && !this.isClicked) {
        oldPosition.classList.add('miss');
        oldPosition.classList.remove('miss');
      }

      newCell.appendChild(this.character);
      this.currentPosition = newCell;
      this.isClicked = false;
    }
  }

  startGame() {
    this.moveInterval = setInterval(() => {
      this.moveToRandomCell();
    }, 1000);
  }

  stopGame() {
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
    }
  }
}