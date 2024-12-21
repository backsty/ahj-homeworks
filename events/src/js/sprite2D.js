export default class Sprite {
  constructor(boardEl) {
    this.sprite = 'sprite';
    this.positionSprite = -1;
    this.boardEl = boardEl;
  }

  randomPositionSprite(size) {
    const divs = this.boardEl.querySelectorAll('.field');

    const randomInt = Math.floor(Math.random() * (size ** 2));
    if (this.positionSprite >= 0) {
      divs[this.positionSprite].classList.remove(this.sprite);
      this.positionSprite = -1;
    }

    divs[randomInt].classList.add(this.sprite);
    this.positionSprite = randomInt;
  }
}