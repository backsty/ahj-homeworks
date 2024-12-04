export default class MovieTable {
  constructor(data) {
    this.originalData = data;
    this.data = [...data];
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
          <td data-sort="id">id</td>
          <td data-sort="title">title</td>
          <td data-sort="year">year</td>
          <td data-sort="imdb">imdb</td>
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
    const tbody = this.tbody;
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    this.data.forEach(movie => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>#${movie.id}</td>
        <td>${movie.title}</td>
        <td>(${movie.year})</td>
        <td>imdb: ${movie.imdb.toFixed(2)}</td>
      `;
      tbody.appendChild(row);
    });
  }

  sort() {
    const { field, order } = this.currentSort;

    const sortedData = [...this.data].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];

      if (field !== 'title') {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }

      if (order === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });


    this.data = sortedData;
    this.renderRows();
    this.updateSortIndicator();
  }

  updateSortIndicator() {
    const headers = this.container.querySelectorAll('th');

    headers.forEach(header => {
      const field = header.dataset.sort;
      const arrow = field === this.currentSort.field
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
    // this.updateSortIndicator();
  }

  startAutoSort() {
    setInterval(() => this.nextSort(), 2000);
  }
}