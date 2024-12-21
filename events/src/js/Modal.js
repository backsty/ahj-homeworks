export default class Modal {
  constructor(modalEl) {
    this.modalEl = modalEl;
  }

  show(message) {
    this.modalEl.querySelector('h2').textContent = message;
    this.modalEl.classList.remove('hidden');
  }

  hide() {
    this.modalEl.classList.add('hidden');
  }
}