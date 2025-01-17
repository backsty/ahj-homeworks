import API from './api.js';
import Modal from './Modal.js';
import TicketView from './TicketView.js';
import StateManager from './StateManager.js';

export default class App {
    constructor() {
        this.api = new API('http://localhost:7070/tickets');
        this.modal = new Modal();
        this.ticketView = new TicketView(document.querySelector('.container'));
        this.stateManager = new StateManager();

        document.addEventListener('DOMContentLoaded', () => {
            this.addTicketBtn = document.querySelector('.add-ticket');
            if (this.addTicketBtn) {
                this.registerEvents();
                this.init();
            } else {
                console.error('Add ticket button not found');
            }
        });
    }

    async init() {
        try {
            const savedTickets = this.stateManager.loadState();
            if (savedTickets.length > 0) {
                this.ticketView.renderTickets(savedTickets);
            }
            await this.loadTickets();
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }

    registerEvents() {
        this.addTicketBtn.addEventListener('click', () => this.showCreateTicketModal());
        this.ticketView.onTicketClick = (id) => this.showTicketDetails(id);
        this.ticketView.onEditClick = (id) => this.showEditTicketModal(id);
        this.ticketView.onDeleteClick = (id) => this.showDeleteConfirmation(id);
        this.ticketView.onStatusChange = (id) => this.toggleTicketStatus(id);
    }

    async loadTickets() {
        try {
            this.showLoading();
            const tickets = await this.api.getAllTickets();
            this.ticketView.renderTickets(tickets);
            this.stateManager.saveState(tickets);
        } catch (error) {
            console.error('Error loading tickets', error);
        } finally {
            this.hideLoading();
        }
    }

    showLoading() {
        if (document.querySelector('.loading')) return;

        const loader = document.createElement('div');
        loader.className = 'loading';
        loader.innerHTML = `
            <div class="lds-grid">
                <div></div><div></div><div></div>
                <div></div><div></div><div></div>
                <div></div><div></div><div></div>
            </div>
        `;
        document.body.appendChild(loader);
    }

    hideLoading() {
        const loader = document.querySelector('.loading');
        if (loader) loader.remove();
    }

    showCreateTicketModal() {
        try {
            const content = `
                <form id="create-ticket-form" class="ticket-form">
                    <h2>Создать тикет</h2>
                    <input type="text" 
                        name="name" 
                        placeholder="Краткое описание" 
                        required 
                        autocomplete="off">
                    <textarea name="description" 
                            placeholder="Подробное описание" 
                            required 
                            autocomplete="off"
                            rows="3"
                            style="resize: none; min-height: 100px;"
                            ></textarea>
                    <div class="form-buttons">
                        <button type="submit">Создать</button>
                        <button type="button" class="cancel-btn">Отмена</button>
                    </div>
                </form>
            `;
            this.modal.show(content);

            const textarea = document.querySelector('textarea[name="description"]');
            const adjustHeight = () => {
                textarea.style.height = '100px';
                textarea.style.height = textarea.scrollHeight + 'px';
            };

            textarea.addEventListener('input', () => {
                adjustHeight();
                textarea.value = textarea.value.replace(/\n\s*\n/g, '\n');
            });

            textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    setTimeout(adjustHeight, 0);
                }
            });

            adjustHeight();

            const form = document.getElementById('create-ticket-form');
            const handleSubmit = async (e) => {
                e.preventDefault();
                try {
                    const formData = new FormData(e.target);
                    await this.createTicket({
                        name: formData.get('name'),
                        description: formData.get('description'),
                        status: false,
                    });
                } finally {
                    form.removeEventListener('submit', handleSubmit);
                }
            };

            form.addEventListener('submit', handleSubmit);
            form.querySelector('.cancel-btn').addEventListener('click', () => {
                form.reset();
                this.modal.close();
            });
        } catch (error) {
            console.error('Error in create modal:', error);
            this.modal.close();
        }
    }

    async createTicket(ticket) {
        try {
            this.showLoading();
            await this.api.createTicket(ticket);
            await this.loadTickets();
            this.modal.close();
        } catch (error) {
            console.error('Error creating ticket', error);
        } finally {
            this.hideLoading();
        }
    }

    async showTicketDetails(id) {
        try {
            this.showLoading();
            const ticket = await this.api.getTicketById(id);
            const content = `
                <div class="ticket-details">
                    <h2>${ticket.name}</h2>
                    <p>${ticket.description}</p>
                    <p>Status: ${ticket.status ? 'Done' : 'In Progress'}</p>
                    <p>Created: ${new Date(ticket.created).toLocaleString()}</p>
                </div>
            `;
            this.modal.show(content);
        } catch (error) {
            console.error('Error loading ticket details', error);
        } finally {
            this.hideLoading();
        }
    }

    async updateTicket(id, ticket) {
        try {
            this.showLoading();
            await this.api.updateTicket(id, ticket);
            await this.loadTickets();
            this.modal.close();
        } catch (error) {
            console.error('Error updating ticket', error);
        } finally {
            this.hideLoading();
        }
    }

    async showEditTicketModal(id) {
        try {
            this.showLoading();
            const ticket = await this.api.getTicketById(id);
            const content = `
                <form id="edit-ticket-form" class="ticket-form">
                    <h2>Редактировать тикет</h2>
                    <input type="text" 
                        name="name" 
                        value="${ticket.name}" 
                        required 
                        autocomplete="off">
                    <textarea name="description" 
                            required 
                            autocomplete="off"
                            rows="3"
                            style="resize: none; min-height: 100px;"
                            >${ticket.description}</textarea>
                    <div class="form-buttons">
                        <button type="submit">Сохранить</button>
                        <button type="button" class="cancel-btn">Отмена</button>
                    </div>
                </form>
            `;
            this.modal.show(content);
            
            const textarea = document.querySelector('textarea[name="description"]');
            const adjustHeight = () => {
                textarea.style.height = '100px';  // Сбрасываем до минимальной высоты
                textarea.style.height = textarea.scrollHeight + 'px';
            };

            textarea.addEventListener('input', () => {
                adjustHeight();
                // Убираем двойные переносы строк
                textarea.value = textarea.value.replace(/\n\s*\n/g, '\n');
            });

            // Убираем preventDefault для Enter чтобы работал стандартный перенос
            textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    setTimeout(adjustHeight, 0);
                }
            });

            adjustHeight();

            const form = document.getElementById('edit-ticket-form');
            const handleSubmit = async (e) => {
                e.preventDefault();
                try {
                    const formData = new FormData(e.target);
                    await this.updateTicket(id, {
                        name: formData.get('name'),
                        description: formData.get('description'),
                        status: ticket.status,
                    });
                } finally {
                    form.removeEventListener('submit', handleSubmit);
                }
            };

            form.addEventListener('submit', handleSubmit);
            form.querySelector('.cancel-btn').addEventListener('click', () => {
                form.reset();
                this.modal.close();
            });
        } catch (error) {
            console.error('Error loading ticket for edit', error);
            this.modal.close();
        } finally {
            this.hideLoading();
        }
    }

    showDeleteConfirmation(id) {
        try {
            const content = `
                <div class="delete-confirmation">
                    <h2>Удалить тикет?</h2>
                    <div class="modal-buttons">
                        <button id="confirm-delete" class="danger-btn">Да</button>
                        <button id="cancel-delete">Отмена</button>
                    </div>
                </div>
            `;
            this.modal.show(content);

            const confirmBtn = document.getElementById('confirm-delete');
            const cancelBtn = document.getElementById('cancel-delete');

            const cleanup = () => {
                confirmBtn?.removeEventListener('click', handleConfirm);
                cancelBtn?.removeEventListener('click', handleCancel);
            };

            const handleConfirm = async () => {
                try {
                    this.showLoading();
                    await this.deleteTicket(id);
                    this.modal.close();
                } catch (error) {
                    console.error('Error deleting ticket:', error);
                } finally {
                    this.hideLoading();
                    cleanup();
                }
            };
    

            const handleCancel = () => {
                this.modal.close();
                cleanup();
            };

            confirmBtn?.addEventListener('click', handleConfirm);
            cancelBtn?.addEventListener('click', handleCancel);
        } catch (error) {
            console.error('Error in delete confirmation:', error);
            this.modal.close();
        }
    }

    async deleteTicket(id) {
        try {
            this.showLoading();
            await this.api.deleteTicket(id);
            await this.loadTickets();
            this.modal.close();
        } catch (error) {
            console.error('Error deleting ticket', error);
        } finally {
            this.hideLoading();
        }
    }

    async toggleTicketStatus(id) {
        try {
            if (document.querySelector('.loading')) return;

            this.showLoading();
            const ticket = await this.api.getTicketById(id);
            if (!ticket) throw new Error('Ticket not found');
            await this.api.updateTicket(id, { ...ticket, status: !ticket.status });
            await this.loadTickets();
        } catch (error) {
            console.error('Error updating ticket status', error);
        } finally {
            this.hideLoading();
        }
    }
};