const CACHE_NAME = 'time-capsule-v5-force-pin-gate';
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
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    // Supabase veya harici istekleri doğrudan ağa bırak
    if (e.request.url.includes('supabase.co') || e.request.url.includes('unsplash.com') || e.request.url.includes('cdnjs.cloudflare.com')) {
        return;
    }

    // Network-First stratejisi (Önce ağdan güncel dosyayı çek, internet yoksa önbellekten ver)
    e.respondWith(
        fetch(e.request)
            .then((networkRes) => {
                if (networkRes && networkRes.status === 200) {
                    const resClone = networkRes.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
                }
                return networkRes;
            })
            .catch(() => caches.match(e.request).then(res => res || caches.match('./index.html')))
    );
});
