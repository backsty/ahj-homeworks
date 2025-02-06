export default {
    port: process.env.PORT || 3000,
    delay: process.env.DELAY || 2000,
    cors: {
        origin: process.env.NODE_ENV === 'production' 
            ? 'https://backsty.github.io'
            : 'http://localhost:8080',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },
    isProduction: process.env.NODE_ENV === 'production'
}