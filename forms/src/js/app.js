import { PopoverWidget } from './popover.js';

console.log('app.js is bunled');

const popoverContainer = document.querySelector('.container');
const popoverMessages = {
  default: {
    title: 'Popover Title',
    content: 'And here`s some amazing content. It`s very engaging. Right?',
  },
  error: {
    title: 'Ошибка',
    content: 'Что-то пошло не так',
  },
};

const popoverFactory = new PopoverWidget();
let activePopovers = [];

const showPopover = (element) => {
  const title = element.dataset.title || popoverMessages.default.title;
  const content = element.dataset.content || popoverMessages.default.content;

  activePopovers.push({
    name: element,
    id: popoverFactory.showPopover(title, content, element),
  });
};

const removePopover = (element) => {
  const currentPopover = activePopovers.find(item => item.element === element);
  
  if (currentPopover) {
    popoverFactory.removePopover(currentPopover.id);
    activePopovers = activePopovers.filter(item => item.id !== currentPopover.id);
  }
};

popoverContainer.addEventListener('click', (e) => {
  const target = e.target.closest('[data-popover]');

  if (!target) {
    activePopovers.forEach(popover => {
      popoverFactory.removePopover(popover.id);
    });
    activePopovers = [];
    return;
  }

  e.preventDefault();

  const hasActivePopover = activePopovers.some(p => p.element === target);

  if (hasActivePopover) {
    removePopover(target);
  } else {
    showPopover(target);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  new PopoverWidget();
});