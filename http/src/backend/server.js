import Koa from 'koa';
import cors from '@koa/cors';
import { koaBody } from 'koa-body';
import tickets from './routes/tickets.js';

const app = new Koa();

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'https://backsty.github.io');
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  ctx.set('Access-Control-Allow-Credentials', 'true');
  ctx.set('Access-Control-Max-Age', '86400'); // 24 часа

  if (ctx.method === 'OPTIONS') {
    ctx.status = 204;
    return;
  }
  await next();
});

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
  exposeHeaders: ['Content-Length', 'Date', 'X-Request-Id']
}));

app.use(koaBody({
  json: true,
  urlencoded: true,
  multipart: true
}));

app.use(tickets.routes());
app.use(tickets.allowedMethods());

const PORT = process.env.PORT || 7070;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
