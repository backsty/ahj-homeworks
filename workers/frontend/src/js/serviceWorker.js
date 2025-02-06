import { Workbox } from 'workbox-window';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

export async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    try {
        const wb = new Workbox('/service-worker.js');
        await wb.register();

        wb.addEventListener('installed', event => {
            if (event.isUpdate) {
                if (confirm('Доступно обновление. Обновить страницу?')) {
                    window.location.reload();
                }
            }
        })
    } catch (error) {
        console.log('Service worker registration failed:', error);
    }
}


// Кэширование изображений
registerRoute(
    ({request}) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'images-cache',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
            new CacheableResponsePlugin({
                statuses: [0, 200]
            })
        ]
    })
);

// Кэширование Api запросов
registerRoute(
    ({url}) => url.pathname.startsWith('/api/'),
    new NetworkFirst({
        cacheName: 'api-cache',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60,
            }),
            new CacheableResponsePlugin({
                statuses: [0, 200]
            })
        ]
    })
);

// Предварительное кэширование
precacheAndRoute(self.__WB_MANIFEST || []);
