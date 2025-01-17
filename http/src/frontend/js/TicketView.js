export default class TicketView {
    constructor(container) {
        this.container = container;
        this.tickets = [];
        this.addEventListeners();
    }

    renderTickets(tickets) {
        this.tickets = tickets;
        this.container.innerHTML = tickets.map(ticket => this.createTicketHTML(ticket)).join('');
    }

    addEventListeners() {
        this.container.addEventListener('click', (event) => {
            // event.preventDefault();
            const ticket = event.target.closest('.ticket');
            if (!ticket) return;

            const id = ticket.dataset.id;
            const target = event.target.closest('button, .status-checkbox, label');

            if (target) {
                if (target.classList.contains('edit-btn')) {
                    event.preventDefault();
                    this.onEditClick?.(id);
                } else if (target.classList.contains('delete-btn')) {
                    event.preventDefault();
                    this.onDeleteClick?.(id);
                } else if (target.classList.contains('status-checkbox') || target.getAttribute('for')?.startsWith('status-')) {
                    this.onStatusChange?.(id);
                }
            } else if (event.target.closest('.ticket-content')) {
                event.preventDefault();
                this.onTicketClick?.(id);
            }
        });
    }

    createTicketHTML(ticket) {
        const checkboxIcon = ticket.status 
            ? '<path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>'
            : '<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Z"/>';

        return `
            <div class="ticket" data-id="${ticket.id}">
                <div class="ticket-status">
                    <input type="checkbox" 
                           class="status-checkbox" 
                           id="status-${ticket.id}" 
                           ${ticket.status ? 'checked' : ''}>
                    <label for="status-${ticket.id}">
                        <svg class="icon" viewBox="0 -960 960 960">
                            ${checkboxIcon}
                        </svg>
                    </label>
                </div>
                <div class="ticket-content">
                    <h3>${ticket.name}</h3>
                    <p>Created: ${new Date(ticket.created).toLocaleString()}</p>
                </div>
                <div class="ticket-controls">
                    <button class="edit-btn" title="Редактировать">
                        <svg class="icon" viewBox="0 -960 960 960">
                            <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Z"/>
                        </svg>
                    </button>
                    <button class="delete-btn" title="Удалить">
                        <svg class="icon" viewBox="0 -960 960 960">
                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }
};