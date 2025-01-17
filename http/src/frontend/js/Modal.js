export default class Modal {
  constructor() {
    this.modal = document.createElement('div');
    this.modal.className = 'modal';
    this.modal.innerHTML = `
        <div class="modal-content">
            <button type="button" class="close-btn" aria-label="Закрыть">
                <svg class="icon" viewBox="0 -960 960 960">
                    <path d="M256-213.847 213.847-256l224-224-224-224L256-746.153l224 224 224-224L746.153-704l-224 224 224 224L704-213.847l-224-224-224 224Z"/>
                </svg>
            </button>
            <div class="modal-body"></div>
        </div>
    `;
    document.body.appendChild(this.modal);

    this.closeBtn = this.modal.querySelector('.close-btn');
    this.modalBody = this.modal.querySelector('.modal-body');

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
  }

  show(content) {
    this.modal.classList.add('active');
    this.modalBody.innerHTML = content;
  }

  close() {
    this.modal.classList.remove('active');
    setTimeout(() => {
      this.modalBody.innerHTML = '';
    }, 300);
  }
};