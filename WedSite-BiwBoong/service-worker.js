const CACHE_NAME = "biwbong-pwa-v2";

const CACHE_FILES = [
    "/",
    "/index.html",
    "/images/logo.png",
    "/images/logo192.png",
    "/images/logo512.png"
];

// Install
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CACHE_FILES);
        })
    );

    self.skipWaiting();
});

// Activate
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );

    self.clients.claim();
});

// Fetch
self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {

            // มีใน Cache
            if (cachedResponse) {
                return cachedResponse;
            }

            // ไม่มีใน Cache → โหลดจาก Internet
            return fetch(event.request).catch(() => {
                return caches.match("/index.html");
            });
        })
    );
});