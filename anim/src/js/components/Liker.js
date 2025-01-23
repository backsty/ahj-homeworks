export default class Liker {
  constructor(container) {
    this.container = container;
    this.init();
  }

  init() {
    this.bindToDOM();
    this.registerEvents();
  }

  bindToDOM() {
    this.container.innerHTML = `
            <div class="liker-widget">
                <button class="like-button">Like</button>
                <div class="hearts-container"></div>
            </div>
        `;

    this.button = this.container.querySelector('.like-button');
    this.heartsContainer = this.container.querySelector('.hearts-container');
  }

  registerEvents() {
    this.button.addEventListener('click', () => this.addHeart());
  }

  addHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';

    const offset = Math.random() * 100 - 50;
    heart.style.setProperty('--offset', `${offset}px`);

    const trajectory = this.getRandomTrajectory();
    heart.style.setProperty('--trajectory', trajectory);

    this.heartsContainer.appendChild(heart);

    heart.addEventListener('animationend', () => {
      heart.remove();
    });
  }

  getRandomTrajectory() {
    const trajectories = [
      'var(--trajectory-1)',
      'var(--trajectory-2)',
      'var(--trajectory-3)',
      'var(--trajectory-4)',
    ];

    const randomIndex = Math.floor(Math.random() * trajectories.length);
    return trajectories[randomIndex];
  }
}
