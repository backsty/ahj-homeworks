import Router from 'koa-router';
import Ticket from '../models/Ticket.js';

const tickets = new Map();
let nextId = 1;

const router = new Router();

router
  .get("/tickets", async (ctx) => {
    const { method, id } = ctx.query;
    switch (method) {
      case "allTickets":
        ctx.body = Array.from(tickets.values()).map(ticket => ticket.toJSON());
        break;
      case "ticketById":
        const ticket = tickets.get(Number(id));
        if (ticket) {
          ctx.body = ticket.toFullJSON();
        } else {
          ctx.status = 404;
          ctx.body = { message: "Ticket not found" };
        }
        break;
      default:
        ctx.status = 404;
        ctx.body = { error: "Method not found" };
    }
  })
  .post('/tickets', async (ctx) => {
    const { method } = ctx.query;
    if (method === 'createTicket') {
      const { name, description, status } = ctx.request.body;
      const ticket = new Ticket(nextId++, name, description, status);
      tickets.set(ticket.id, ticket);
      ctx.body = ticket.toJSON();
    }
  })
  .put('/tickets', async (ctx) => {
    const { method, id } = ctx.query;
    if (method === 'updateTicket') {
      const ticket = tickets.get(Number(id));
      if (ticket) {
        const { name, description, status } = ctx.request.body;
        Object.assign(ticket, { name, description, status });
        ctx.body = ticket.toJSON();
      } else {
        ctx.status = 404;
        ctx.body = { message: 'Ticket not found' };
      }
    }
  })
  .delete('/tickets', async (ctx) => {
    const { method, id } = ctx.query;
    if (method === 'deleteTicket') {
      if (tickets.delete(Number(id))) {
        ctx.body = { message: 'Ticket deleted' };
      } else {
        ctx.status = 404;
        ctx.body = { message: 'Ticket not found' };
      }
    }
  });

export default router;
