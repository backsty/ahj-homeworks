import Collapse from './components/Collapse.js';
import Feedback from './components/Feedback.js';
import Liker from './components/Liker.js';

document.addEventListener('DOMContentLoaded', () => {
  // Collapse
  const collapseContainers = document.querySelectorAll('[data-collapse]');
  [...collapseContainers].forEach(container => new Collapse(container));

  // Feedback
  const feedbackContainer = document.querySelector('#feedback-container');
  new Feedback(feedbackContainer);

  // Liker
  const likerContainer = document.querySelector('#liker-container');
  new Liker(likerContainer);
});
