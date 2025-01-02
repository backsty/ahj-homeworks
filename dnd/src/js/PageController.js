import cursors from './cursors.js';
import pageUi from './PageUi.js';

export default class PageController {
  constructor(ui, stateService) {
    this.ui = ui;
    this.stateService = stateService;
    this.dragEl = null;
    this.ghostEl = null;
    this.shiftX = null;
    this.shiftY = null;
    this.elInitialX = null;
    this.elInitialY = null;
  }

  init() {
    this.ui.bindToDom(document.querySelector('.board'));
    this.ui.drawUi();
    this.loadState();
    this.addEventListeners();
  }

  loadState() {
    const state = this.stateService.load();
    Object.entries(state).forEach(([columnId, cards]) => {
      const container = document.querySelector(`[data-column="${columnId}"] .cards-container`);
      if (container) {
        container.innerHTML = '';
        cards.forEach(cardText => {
          container.appendChild(this.ui.constructor.createCard(cardText));
        });
      }
    });
  }

  saveState() {
    const state = {};
    this.ui.data.forEach(column => {
      const container = document.querySelector(`[data-column="${column.id}"] .cards-container`);
      if (container) {
        state[column.id] = Array.from(container.children).map(card =>
          card.querySelector('.card-content').textContent,
        );
      }
    });
    this.stateService.save(state);
  }

  addEventListeners() {
    // Обработчики drag&drop
    document.addEventListener('mousedown', this.onMouseDown.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));

    // Обработчик удаления карточки
    this.ui.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('card-delete')) {
        const card = e.target.closest('.card');
        if (card) {
          this.ui.constructor.deleteCard(card);
          this.saveState();
        }
      }

      // Показать форму при клике на "Добавить карточку"
      if (e.target.classList.contains('add-card')) {
        const column = e.target.closest('.column');
        const form = column.querySelector('.add-card-form');
        e.target.classList.add('hidden');
        form.classList.remove('hidden');
        form.querySelector('.card-input').focus();
      }

      // Скрыть форму при клике на "Отмена"
      if (e.target.classList.contains('cancel-btn')) {
        const form = e.target.closest('.add-card-form');
        form.reset();
        form.classList.add('hidden');
        const addButton = form.closest('.column').querySelector('.add-card');
        addButton.classList.remove('hidden');
      }
    });

    // Обработчик отправки формы
    this.ui.container.addEventListener('submit', (e) => {
      if (e.target.classList.contains('add-card-form')) {
        e.preventDefault();
        const form = e.target;
        const input = form.querySelector('.card-input');
        const text = input.value.trim();

        if (text) {
          const column = form.closest('.column');
          const container = column.querySelector('.cards-container');
          container.appendChild(this.ui.constructor.createCard(text));
          this.saveState();
        }

        form.reset();
        form.classList.add('hidden');
        const addButton = form.closest('.column').querySelector('.add-card');
        addButton.classList.remove('hidden');
      }
    });
  }

  onMouseDown(event) {
    const card = event.target.closest('.card');
    if (!card || event.target.closest('.card-delete')) return;
    event.preventDefault();
  
    this.dragEl = card;
    const rect = card.getBoundingClientRect();
    
    this.shiftX = event.clientX - rect.left;
    this.shiftY = event.clientY - rect.top;
    
    this.dragEl.style.opacity = '0.5';
    document.body.style.cursor = cursors.GRABBING;
  }

  onMouseMove(event) {
    if (!this.dragEl) return;
    event.preventDefault();
  
    if (!this.ghostEl) {
      this.createGhost(this.dragEl);
    }
  
    const newX = event.clientX - this.shiftX;
    const newY = event.clientY - this.shiftY;
    
    this.ghostEl.style.left = `${newX}px`;
    this.ghostEl.style.top = `${newY}px`;
  
    const columnUnder = event.target.closest('.cards-container');
    if (columnUnder) {
      const closestCard = this.getClosestCard(columnUnder, event.clientY);
      this.updateDropPosition(columnUnder, closestCard);
    }
  }

  onMouseUp() {
    if (!this.dragEl) return;

    document.body.style.cursor = cursors.DEFAULT;
    const placeholder = document.querySelector('.ghost-placeholder');
    if (placeholder) {
      placeholder.replaceWith(this.dragEl);
    }

    this.dragEl.style.opacity = '';
    this.removeGhost();
    this.saveState();
    
    this.dragEl = null;
  }

  createGhost(element) {
    this.ghostEl = element.cloneNode(true);
    this.ghostEl.classList.add('dragged');
    this.ghostEl.style.position = 'fixed';
    this.ghostEl.style.width = `${element.offsetWidth}px`;
    this.ghostEl.style.height = `${element.offsetHeight}px`;
    this.ghostEl.style.zIndex = '1000';
    this.ghostEl.style.pointerEvents = 'none';
    document.body.appendChild(this.ghostEl);
  }

  removeGhost() {
    if (this.ghostEl) {
      this.ghostEl.remove();
      this.ghostEl = null;
    }
  }

  updateDropPosition(container, card) {
    const placeholder = document.querySelector('.ghost-placeholder') 
      || document.createElement('div');
    
    placeholder.className = 'ghost-placeholder';
    placeholder.style.height = `${this.dragEl.offsetHeight}px`;
  
    if (card) {
      if (card !== placeholder) {
        card.parentNode.insertBefore(placeholder, card);
      }
    } else {
      container.appendChild(placeholder);
    }
  }

  getClosestCard(container, y) {
    const cards = [...container.querySelectorAll('.card:not(.dragged)')];

    return cards.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }
}
