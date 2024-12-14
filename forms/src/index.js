import './css/style.css';
import PopoverWidget from './js/popover.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    const popover = new PopoverWidget();
    console.log('PopoverWidget initialized');
  } catch (error) {
    console.error('Failed to initialize PopoverWidget:', error);
  }
});