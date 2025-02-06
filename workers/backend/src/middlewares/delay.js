export const delayMiddleware = (ms) => async (ctx, next) => {
    // Симулируем случайную задержку от 1 до 3 секунд
    const delay = Math.random() * 2000 + 1000;
    await new Promise(resolve => setTimeout(resolve, ms));
    await next();
};