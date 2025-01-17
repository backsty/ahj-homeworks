export default class TicketApi {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async getAllTickets() {
    const response = await fetch(`${this.baseUrl}?method=allTickets`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
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