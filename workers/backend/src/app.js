import Koa from 'koa';
import cors from '@koa/cors';
import Router from '@koa/router';
import { delayMiddleware } from './middlewares/delay.js';
import config from './config.js';

const app = new Koa();
const router = new Router({ prefix: '/api' });

// Middleware
app.use(cors(config.cors));
app.use(delayMiddleware(config.delay));

// Моковые данные
const newsData = {
  items: [
    {
      id: 1,
      title: 'Первая новость',
      description: 'Описание первой новости'
    },
    {
      id: 2,
      title: 'Вторая новость',
      description: 'Описание второй новости'
    },
    {
      id: 3,
      title: 'Третья новость',
      description: 'Описание третьей новости'
    }
  ]
};

// Маршруты
router.get('/news', ctx => {
  const shouldFail = Math.random() < 0.3; // 30% шанс ошибки


  if (shouldFail) {
    ctx.status = 500;
    ctx.body = { error: 'Server temporarily unavailable' };
    return;
  }
  
  ctx.body = newsData;
});

// Обработка ошибок
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.status = error || 500;
    ctx.body = {
      error: error.message || 'Internal server error'
    };
    ctx.app.emit('error', error, ctx);
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

// Запуск сервера
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export default app;
