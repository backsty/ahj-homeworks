export default class TicketApi {
  constructor(baseUrl) {
    // this.baseUrl = baseUrl;
    this.baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:7070/tickets'
      : 'https://ahj-backend.herokuapp.com/tickets';
  }

  async getAllTickets() {
    try {
      const response = await fetch(`${this.baseUrl}?method=allTickets`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      return [];
    }
  }

  async getTicketById(id) {
    const response = await fetch(`${this.baseUrl}?method=ticketById&id=${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async createTicket(data) {
    const response = await fetch(`${this.baseUrl}?method=createTicket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  }

  async updateTicket(id, data) {
    const response = await fetch(`${this.baseUrl}?method=updateTicket&id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async deleteTicket(id) {
    const response = await fetch(`${this.baseUrl}?method=deleteTicket&id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
};