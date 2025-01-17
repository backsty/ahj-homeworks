import Koa from 'koa';
import cors from '@koa/cors';
import { koaBody } from 'koa-body';
import tickets from './routes/tickets.js';

const app = new Koa();

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