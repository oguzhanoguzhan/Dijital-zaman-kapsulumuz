const CACHE_NAME = 'time-capsule-v2';
const STATIC_ASSETS = [
    './',
    './index.html',
    './css/style.css',
    './js/config.js',
    './js/audio.js',
    './js/particles.js',
    './js/supabase-client.js',
    './js/voice-recorder.js',
    './js/fortune-tasks.js',
    './js/image-uploader.js',
    './js/app.js',
    './manifest.json',
    './icons/icon.svg'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    // Supabase veya harici CDN isteklerini doğrudan ağa bırak
    if (e.request.url.includes('supabase.co') || e.request.url.includes('unsplash.com') || e.request.url.includes('cdnjs.cloudflare.com')) {
        return;
    }

    e.respondWith(
        caches.match(e.request).then((res) => {
            return res || fetch(e.request).catch(() => caches.match('./index.html'));
        })
    );
});
