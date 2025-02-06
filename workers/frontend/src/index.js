import './css/style.css';
import App from './js/app.js';

document.addEventListener('DOMContentLoaded', () => {
    new App({
        apiUrl: process.env.API_URL || 'http://localhost:3000/api'
    });
});