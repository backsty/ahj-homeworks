import PopoverWidget from './popover.js';

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

let popoverFactory = null;
let activePopovers = [];

function showPopover(element) {
  const title = element.dataset.title || popoverMessages.default.title;
  const content = element.dataset.content || popoverMessages.default.content;

  const id = popoverFactory.showPopover(title, content, element);
  activePopovers.push({
    element,
    id,
  });
}

function removePopover(element) {
  const popover = activePopovers.find(p => p.element === element);
  if (popover) {
    popoverFactory.removePopover(popover.id);
    activePopovers = activePopovers.filter(p => p.id !== popover.id);
  }
}

function removeAllPopovers() {
  activePopovers.forEach(popover => {
    popoverFactory.removePopover(popover.id);
  });
  activePopovers = [];
}

function handleClick(event) {
  const target = event.target.closest('[data-popover]');
  
  if (!target) {
    removeAllPopovers();
    return;
  }

  event.preventDefault();

  const hasActivePopover = activePopovers.some(p => p.element === target);
  if (hasActivePopover) {
    removePopover(target);
  } else {
    showPopover(target);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    popoverFactory = new PopoverWidget();
    popoverContainer.addEventListener('click', handleClick);
    console.log('PopoverWidget initialized successfully');
  } catch (error) {
    console.error('Failed to initialize PopoverWidget:', error);
  }
});