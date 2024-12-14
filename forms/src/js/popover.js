export default class PopoverWidget {
  constructor() {
    this._popovers = [];
    this.init();
  }

  init() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-popover]');
      
      if (!trigger) {
        this.removeAllPopovers();
        return;
      }

      e.preventDefault();
      const title = trigger.dataset.title;
      const content = trigger.dataset.content;
      this.togglePopover(title, content, trigger);
    });
  }

  togglePopover(title, content, element) {
    const existingPopover = this._popovers.find(p => p.trigger === element);
    
    if (existingPopover) {
      this.removePopover(existingPopover.id);
      return;
    }

    this.showPopover(title, content, element);
  }

  showPopover(title, content, element) {
    const popoverElement = document.createElement('div');
    popoverElement.classList.add('popover');
    
    popoverElement.innerHTML = `
      <h3 class="popover-header">${title}</h3>
      <div class="popover-body">${content}</div>
    `;

    const id = performance.now();
    const updatePosition = () => {
      const { left, top, width } = element.getBoundingClientRect();
      popoverElement.style.left = `${left + width/2}px`;
      popoverElement.style.top = `${window.scrollY + top}px`;
    };

    this._popovers.push({
      id,
      element: popoverElement,
      trigger: element,
      updatePosition,
    });

    document.body.appendChild(popoverElement);
    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return id;
  }

  removePopover(id) {
    const popover = this._popovers.find(p => p.id === id);

    if (!popover) return;
    
    if (popover) {
      popover.element.remove();
      this._popovers = this._popovers.filter(p => p.id !== id);
    }
  }

  removeAllPopovers() {
    this._popovers.forEach(popover => popover.element.remove());
    this._popovers = [];
  }
};