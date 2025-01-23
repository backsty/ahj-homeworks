export default class Collapse {
  constructor(element) {
    this.element = element;
    this.button = element.querySelector('[data-collapse-trigger]');
    this.content = element.querySelector('[data-collapse-content]');
    this.isExtended = false;

    this.init();
  }

  init() {
    this.content.style.height = '0';
    this.content.style.overflow = 'hidden';
    this.content.style.transition = 'height 0.3s ease-out';

    this.button.addEventListener('click', () => this.toggle());
  }

  toggle() {
    this.isExpanded = !this.isExpanded;

    if (this.isExpanded) {
      const height = this.content.scrollHeight;
      this.content.style.height = `${height}px`;
    } else {
      this.content.style.height = '0';
    }

    this.button.setAttribute('aria-expanded', this.isExpanded);
  }
}
