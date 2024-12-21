import GameBoard from './Board.js';
import Sprite from './sprite2D.js';
import cursors from './cursors.js';
import Modal from './Modal.js';

export default class GamePlay {
  constructor(boardEl, modalEl, deadEl, lostEl) {
    this.size = 4;
    this.boardEl = boardEl;
    this.modalEl = modalEl;
    this.countDead = deadEl;
    this.countLost = lostEl;
    this.count = null;
  }

  startGame() {
    if (!this.boardEl || !this.modalEl || !this.countDead || !this.countLost) {
      throw new Error('One or more elements are not defined');
    }

    const board = new GameBoard(this.boardEl);
    board.initBoard(this.size);

    const sprite = new Sprite(this.boardEl);
    const modal = new Modal(this.modalEl);

    this.onCellClick(sprite);
    this.onButtonClick(modal);

    this.gameInterval = setInterval(() => {
      sprite.randomPositionSprite(this.size);

      this.countLost.textContent = +this.countLost.textContent + this.count;

      if (this.count !== 1) {
        setTimeout(() => {
          this.count = 1;
        }, 1000);
      }

      this.checkWinner();
    }, 1000);
  }

  setCursor(cursor) {
    const board = document.getElementById('board');
    if (board) {
      if (cursor === cursors.hammer) {
        board.classList.add('hammer-cursor');
      } else {
        board.classList.remove('hammer-cursor');
      }
    }
  }

  onCellClick() {
    const fields = document.querySelectorAll('.field');

    for (let i = 0; i < fields.length; i++) {
      fields[i].addEventListener('click', () => {
        if (fields[i].classList.contains('sprite')) {
          fields[i].classList.remove('sprite');
          this.countDead.textContent = +this.countDead.textContent + 1;

          this.setCursor(cursors.hammer);

          fields[i].classList.add('hit');
          setTimeout(() => {
            fields[i].classList.remove('hit');
          }, 200);


        } else {
          this.countLost.textContent = +this.countLost.textContent + 1;
        }
        this.checkWinner();
        this.count = 0;
      });
    }
  }

  onButtonClick() {
    const resetButtons = document.querySelectorAll('.reset');

    for (const btn of resetButtons) {
      btn.addEventListener('click', () => {
        if (!this.modalEl.classList.contains('hidden')) {
          this.modalEl.classList.add('hidden');
        }
        this.reset();
        this.startGame();
      });
    }
  }

  reset() {
    this.countDead.textContent = 0;
    this.countLost.textContent = 0;
    clearInterval(this.gameInterval);
  }

  checkWinner() {
    if (this.countDead.textContent == 5) {
      this.showWinner('🍾 Победа! 🍾');
    }

    if (this.countLost.textContent > 5) {
      this.showWinner('Вы проиграли!');
    }
  }

  showWinner(status) {
    const header = this.modalEl.querySelector('h2');
    header.textContent = status;
    this.modalEl.classList.remove('hidden');
    clearInterval(this.gameInterval);
    this.reset();
  }
}
