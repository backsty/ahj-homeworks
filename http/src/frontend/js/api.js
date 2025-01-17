export default class TicketApi {
  constructor() {
    this.baseUrl = window.location.hostname === 'localhost'
      ? 'http://localhost:7070/tickets'
      : 'https://ahj-backend.herokuapp.com/tickets';
  }

  async fetchWithConfig(url, options = {}) {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'include'
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error(`API Error: ${error.message}`);
      throw error;
    }
  }

  async getAllTickets() {
    try {
      return await this.fetchWithConfig(`${this.baseUrl}?method=allTickets`);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      return [];
    }
  }

  async getTicketById(id) {
    return this.fetchWithConfig(`${this.baseUrl}?method=ticketById&id=${id}`);
  }

  async createTicket(data) {
    return this.fetchWithConfig(`${this.baseUrl}?method=createTicket`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateTicket(id, data) {
    return this.fetchWithConfig(`${this.baseUrl}?method=updateTicket&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteTicket(id) {
    return this.fetchWithConfig(`${this.baseUrl}?method=deleteTicket&id=${id}`, {
      method: 'DELETE'
    });
  }
};