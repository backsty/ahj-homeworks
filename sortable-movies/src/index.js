import './css/style.css';
import MovieTable from './js/table.js';

const movies = [
  {
    'id': 26,
    'title': 'Побег из Шоушенка',
    'imdb': 9.30,
    'year': 1994,
  },
  {
    'id': 25,
    'title': 'Крёстный отец',
    'imdb': 9.20,
    'year': 1972,
  },
  {
    'id': 27,
    'title': 'Крёстный отец 2',
    'imdb': 9.00,
    'year': 1974,
  },
  {
    'id': 1047,
    'title': 'Тёмный рыцарь',
    'imdb': 9.00,
    'year': 2008,
  },
  {
    'id': 223,
    'title': 'Криминальное чтиво',
    'imdb': 8.90,
    'year': 1994,
  },
];

document.addEventListener('DOMContentLoaded', () => {
  try {
    const table = new MovieTable(movies);
    table.createTable();
    table.startAutoSort();
  } catch (e) {
    console.error('Failed to initialize table:', e);
  }
});