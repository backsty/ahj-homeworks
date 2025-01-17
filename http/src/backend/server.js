import Koa from 'koa';
import cors from '@koa/cors';
import { koaBody } from 'koa-body';
import tickets from './routes/tickets.js';

const app = new Koa();

app.use(cors({
  origin: (ctx) => {
    const validDomains = [
      'http://localhost:8080',
      'http://localhost:9000',
      'https://backsty.github.io'
    ];
    const origin = ctx.request.header.origin;
    return validDomains.includes(origin) ? origin : false;
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

app.use(cors());
app.use(koaBody({
  urlencoded: true,
  multipart: true,
  json: true,
}));

app.use(tickets.routes());
app.use(tickets.allowedMethods());

const PORT = process.env.PORT || 7070;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});