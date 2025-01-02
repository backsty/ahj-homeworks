import trash from '../img/trash.svg';

export default class PageUi {
  constructor(data) {
    this.data = data;
    this.container = null;
    this.cardsContainerEl = null;
    this.addCards = null;
    this.forms = null;
    this.cancelBtns = null;
    this.inputs = null;
    this.cards = null;
  }

  bindToDom(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('Контейнер не является элементом "HTMLElement"');
    }
    this.container = container;
    if (!this.container) {
      throw new Error('Контейнер не найден');
    }
  }

  drawUi() {
    this.data.forEach((column) => {
      const columnEl = document.querySelector(`[data-column="${column.id}"]`);
      if (columnEl) {
        const title = columnEl.querySelector('h2');
        title.textContent = column.title;
      }
    });

    this.addCards = this.container.querySelectorAll('.add-card');
    this.cards = this.container.querySelectorAll('.cards-container');
    this.addCards.forEach(addButton => {
      const form = PageUi.createAddCardForm();
      addButton.parentElement.appendChild(form);
      
      addButton.addEventListener('click', () => {
        addButton.classList.add('hidden');
        form.classList.remove('hidden');
        form.querySelector('.card-input').focus();
      });
    });
  }

  static createCard(text) {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;

    const content = document.createElement('div');
    content.className = 'card-content';
    content.textContent = text;

    const deleteBtn = document.createElement('img');
    deleteBtn.className = 'card-delete';
    deleteBtn.src = trash;
    deleteBtn.alt = 'Delete';

    card.appendChild(content);
    card.appendChild(deleteBtn);

    return card;
  }

  static createAddCardForm() {
    const form = document.createElement('form');
    form.className = 'add-card-form hidden';
    form.innerHTML = `
      <textarea class="card-input" placeholder="Введите название карточки..."></textarea>
      <div class="form-controls">
        <button type="submit" class="add-btn">Добавить карточку</button>
        <button type="button" class="cancel-btn">×</button>
      </div>
    `;
    
    const textarea = form.querySelector('.card-input');
    textarea.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    });

    return form;
  }

  static deleteCard(card) {
    if (card && card.classList.contains('card')) {
      card.remove();
    }
  }

  static checkBinding() {
    return document.querySelector('.board') !== null;
  }
}
