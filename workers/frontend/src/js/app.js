import Api from './api.js';
import { registerServiceWorker } from './serviceWorker.js';

export default class App {
    constructor(config) {
        this.api = new Api(config.apiUrl);
        this.initElements();
        this.bindEvents();
        this.init();
    }

    initElements() {
        this.elements = {
            loading: document.querySelector('.loading-state'),
            error: document.querySelector('.error-state'),
            content: document.querySelector('.content'),
            retryBtn: document.querySelector('.retry-btn')
        };
    }

    bindEvents() {
        this.elements.retryBtn.addEventListener('click', () => this.loadData());
    }

    async init() {
        await registerServiceWorker();
        await this.loadData();
    }

    async loadData() {
        this.toggleState('loading');
        try {
            const data = await this.api.getData();
            this.renderContent(data);

            // Показываем уведомление если данные пришли из кэша
            const cacheStatus = await this.checkCacheStatus();
            if (cacheStatus.fromCache) {
                this.showCacheNotification();
            }
        } catch (error) {
            this.toggleState('error');
        }
    }

    async checkCacheStatus() {
        const cache = await caches.open('api-cache');
        const cachedResponse = await cache.match(`${this.api.baseUrl}/news`);
        return { fromCache: !!cachedResponse };
    }
    
    showCacheNotification() {
        const notification = document.createElement('div');
        notification.className = 'cache-notification';
        notification.textContent = 'Данные загружены из кэша';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    toggleState(state) {
        const states = ['loading', 'error', 'content'];
        states.forEach(s => {
            this.elements[s].classList.toggle('hidden', s !== state)
        });
    }

    renderContent(data) {
        this.toggleState('content');
        this.elements.content.innerHTML = data.items
            .map(this.createNewsItem)
            .join('');
    }

    createNewsItem(item) {
        return `
            <article class="news-item">
                <h2>${item.title}</h2>
                <p>${item.description}</p>
            </article>
        `;
    }
};