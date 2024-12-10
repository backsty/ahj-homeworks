import './css/style.css';
import CardValidator from './js/components/CardValidator.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  new CardValidator(container);
});