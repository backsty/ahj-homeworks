import CoordinatesParser from '../utils/coordinates.js';

export default class LocationModal {
  constructor(onSubmit) {
    this.onSubmit = onSubmit;
    this.init();
  }

  init() {
    this.createModal();
    this.registerEvents();
  }

  createModal() {
    this.element = document.createElement('div');
    this.element.className = 'modal';

    this.element.innerHTML = `
          <div class="modal-content">
            <h3>Укажите координаты</h3>
            <div class="modal-body">
              <input type="text" 
                    class="coords-input"
                    placeholder="Например: 51.50851, -0.12572">
              <div class="error-message hidden"></div>
            </div>
            <div class="modal-footer">
              <button type="button" class="submit-btn">Сохранить</button>
              <button type="button" class="cancel-btn">Отмена</button>
            </div>
          </div>
        `;

    this.input = this.element.querySelector('.coords-input');
    this.error = this.element.querySelector('.error-message');
  }

  registerEvents() {
    const submitBtn = this.element.querySelector('.submit-btn');
    const cancelBtn = this.element.querySelector('.cancel-btn');

    submitBtn.addEventListener('click', () => this.submit());
    cancelBtn.addEventListener('click', () => this.close());

    this.input.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.submit();
      }
    });
  }

  show() {
    document.body.appendChild(this.element);
    // this.element.classList.add('active');
    this.input.focus();
  }

  close() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  showError(message) {
    this.error.textContent = message;
    this.error.classList.remove('hidden');
  }

  hideError() {
    this.error.classList.add('hidden');
    this.input.classList.remove('error');
  }

  submit() {
    try {
      const coords = this.parseCoordinates(this.input.value);
      this.hideError();
      this.onSubmit(coords);
      this.close();
    } catch (error) {
      this.showError(error.message);
    }
  }

  parseCoordinates(input) {
    return CoordinatesParser.parse(input);
  }
}
