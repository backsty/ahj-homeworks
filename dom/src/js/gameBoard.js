export default class GameBoard {
  constructor(size = 4) {
    this.size = size;
    this.boardElement = null;
  }

  init() {
    const container = document.querySelector('#game-container');
    this.boardElement = document.createElement('div');
    this.boardElement.classList.add('game-board');

    for (let i = 0; i < this.size; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.index = i;
      this.boardElement.appendChild(cell);
    }

    container.appendChild(this.boardElement);
  }

  getRandomEmptyCell() {
    const cells = [...this.boardElement.querySelectorAll('.cell:not(:has(img))')];

    if (cells.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * cells.length);
    return cells[randomIndex];
  }

  getCurrentPosition() {
    return this.boardElement.querySelector('.cell:has(img)');
  }

  getAllCells() {
    return this.boardElement.querySelectorAll('.cell');
  }
}