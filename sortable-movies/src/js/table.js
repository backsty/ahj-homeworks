export default class MovieTable {
  constructor(data) {
    this.data = data;
    this.container = document.querySelector('.table-container');
    this.sortIndex = 0;
    this.columns = ['id', 'title', 'year', 'imdb'];
    this.sortOrders = ['asc', 'desc'];
    this.currentSort = {
      field: this.columns[0],
      order: this.sortOrders[0],
    };
  }

  createTable() {
    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <td data-sort="id"></td>
          <td data-sort="title"></td>
          <td data-sort="year"></td>
          <td data-sort="imdb"></td>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }

    this.container.appendChild(table);
    this.tbody = table.querySelector('tbody');
    this.renderRows();
  }

  renderRows() {
    this.tbody.innerHTML = this.data.map(movie => `
      <tr data-id="${movie.id}"
        data-title="${movie.title}"
        data-year="${movie.year}"
        data-imdb="${movie.imdb.toFixed(2)}">
        <td>#${movie.id}</td>
        <td>${movie.title}</td>
        <td>${movie.year}</td>
        <td>${movie.imdb.toFixed(2)}</td>
      </tr>
    `).join('');
  }

  sort() {
    const rows = Array.from(this.tbody.querySelectorAll('tr'));
    const { field, order } = this.currentSort;

    rows.sort((a, b) => {
      let aVal = a.dataset[field];
      let bVal = b.dataset[field];

      if (field !== 'title') {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }

      if (order === 'asc') {
        return aVal > bVal ? 1 : -1;
      }

      return aVal < bVal ? 1 : -1;
    });

    while (this.tbody.firstChild) {
      this.tbody.removeChild(this.tbody.firstChild);
    }

    rows.forEach(row => this.tbody.appendChild(row));
  }

  updateSortIndicator() {
    const headers = this.container.querySelectorAll('th');

    headers.forEach(header => {
      const arrow = header.dataset.sort === this.currentSort.field
        ? (this.currentSort.order === 'asc' ? ' ↑' : ' ↓')
        : ' ↕';
      header.textContent = header.textContent.replace(/[↕↑↓]/, '') + arrow;
    });
  }

  nextSort() {
    const columnIndex = Math.floor(this.sortIndex / 2);
    const orderIndex = this.sortIndex % 2;

    this.currentSort = {
      field: this.columns[columnIndex],
      order: this.sortOrders[orderIndex],
    };

    this.sortIndex = (this.sortIndex + 1) % (this.columns.length * 2);

    this.sort();
    this.updateSortIndicator();
  }

  startAutoSort() {
    setInterval(() => this.nextSort(), 2000);
  }
}