export default class Feedback {
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
            <div class="feedback-widget">
                <button class="feedback-button">Обратная связь</button>
                <form class="feedback-form hidden">
                    <div class="form-header">
                        <h3>Напишите нам</h3>
                        <button type="button" class="close-button">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 -960 960 960">
                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                            </svg>
                        </button>
                    </div>
                    <textarea name="message" rows="8"></textarea>
                    <button type="submit" class="submit-button">Отправить</button>
                </form>
            </div>
        `;

    this.button = this.container.querySelector('.feedback-button');
    this.form = this.container.querySelector('.feedback-form');
    this.closeButton = this.container.querySelector('.close-button');
    this.textarea = this.container.querySelector('textarea');
  }

  registerEvents() {
    this.button.addEventListener('click', () => this.showForm());
    this.closeButton.addEventListener('click', () => this.hideForm());
    this.form.addEventListener('submit', e => this.onSubmit(e));
  }

  showForm() {
    this.button.classList.add('hidden');
    this.form.classList.remove('hidden');
  }

  clearForm() {
    this.textarea.value = '';
  }

  hideForm() {
    this.form.classList.add('hidden');
    this.button.classList.remove('hidden');
    this.clearForm();
  }

  onSubmit(e) {
    e.preventDefault();
    this.hideForm();
  }
}
