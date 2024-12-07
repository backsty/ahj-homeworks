import GameBoard from './gameBoard.js';
import Sprite from './sprite2D.js';
import cursors from './cursors.js';

export default class GamePlay {
  constructor() {
    this.size = 4;
    this.modalElement = document.getElementById('modal');
    this.countDead = null;
    this.countLost = null;
    this.count = null;
  }

  
  startGame() {
    const board = new GameBoard();
    board.initBoard(this.size);

    const sprite = new Sprite();
    
    this.onCellClick();
    this.onButtonClick();
    
    this.gameInterval = setInterval(() => {
      sprite.randomPositionSprite(this.size);
      
      this.countLost.textContent = +this.countLost.textContent + this.count;
      
      if (this.count !== 1) {
        setTimeout(this.count = 1, 1000);
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
    this.countDead = document.getElementById('dead');
    this.countLost = document.getElementById('lost');

    for (let i = 0; i < fields.length; i++) {
      fields[i].addEventListener('click', () => {
        if (fields[i].classList.contains('sprite')) {
          fields[i].classList.remove('sprite');
          this.countDead.textContent = +this.countDead.textContent + 1;

          this.setCursor(cursors.hammer);
          setTimeout(() => {
            this.setCursor(cursors.auto);
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
        if (!this.modalElement.classList.contains('hidden')) {
          this.modalElement.classList.add('hidden');
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
    const header = this.modalElement.querySelector('h2');
    header.textContent = status;
    this.modalElement.classList.remove('hidden');
    clearInterval(this.gameInterval);
    this.reset();
  }
}
