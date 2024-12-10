import { CSS_CLASSES, CARD_IMAGES, MESSAGES, INPUT_RESTRICTIONS } from '../utils/constants.js';
import CardTypeDetector from '../services/cardTypeDetector.js';
import Validator from '../services/cardValidation.js';

export default class CardValidator {
  constructor(container) {
    if (!container) {
      throw new Error('Container element is required');
    }
    this.container = container;
    this.input = null;
    this.cardimage = {};
    this.validator = new Validator();
    this.typeDetector = new CardTypeDetector();

    this.init();
  }

  init() {
    this.renderWidget();
    this.setupListeners();
  }

  renderWidget() {
    this.container.innerHTML = `
      <div class="${CSS_CLASSES.CARD_VALIDATOR}">
        <div class="${CSS_CLASSES.CARD_IMAGES}">
          ${Object.entries(CARD_IMAGES).map(([type, src]) => `
            <img src="${src}" 
                 data-type="${type}" 
                 class="${CSS_CLASSES.CARD_IMAGE}"
                 alt="${type}"
            >
          `).join('')}
        </div>
        <input type="text" 
               class="${CSS_CLASSES.CARD_INPUT}"
               maxlength="${INPUT_RESTRICTIONS.MAX_LENGTH}"
               placeholder="Enter card number">
        <button class="${CSS_CLASSES.VALIDATE_BUTTON}">Validate</button>
      </div>
    `;

    // this.container.innerHTML = markup;
    this.input = this.container.querySelector(`.${CSS_CLASSES.CARD_INPUT}`);
    this.cardImages  = Array.from(this.container.querySelectorAll(`.${CSS_CLASSES.CARD_IMAGE}`));
  }

  setupListeners() {
    this.input.addEventListener('input', (e) => this.handleInput(e));
    this.container.querySelector(`.${CSS_CLASSES.VALIDATE_BUTTON}`)
      .addEventListener('click', () => this.validateCard());
  }

  handleInput(e) {
    let value = e.target.value.replace(/\D/g, '');

    // Форматирование ввода по чанкам
    const chunks = [];
    for (let i = 0; i < value.length; i += INPUT_RESTRICTIONS.CHUNK_SIZE) {
      chunks.push(value.slice(i, i + INPUT_RESTRICTIONS.CHUNK_SIZE));
    }
    this.input.value = chunks.join(' ');

    const cardType = this.typeDetector.detectCardType(value);
    this.highlightCardType(cardType);
  }

  
  highlightCardType(type) {
    this.cardImages.forEach(img => {
      const isActive = img.dataset.type === type;
      img.classList.toggle(CSS_CLASSES.ACTIVE, isActive);
    });
  }
  
  validateCard() {
    const number = this.input.value.replace(/\D/g, '');

    if (!number) {
      this.showValidationResult(false);
      return;
    }

    if (number.length < 13) {
      this.showValidationResult(false);
      return;
    }

    const isValid = this.validator.validateCard(number);
    this.showValidationResult(isValid);
  }

  showValidationResult(isValid) {
    const message = isValid ? MESSAGES.VALID_CARD : MESSAGES.INVALID_CARD;
    this.input.classList.toggle(CSS_CLASSES.VALID, isValid);
    this.input.classList.toggle(CSS_CLASSES.INVALID, !isValid);
    alert(message);
  }
}