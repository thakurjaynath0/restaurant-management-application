const CACHE_NAME = "version-1";
const urlsTocache = ['index.html', 'offline.html'];

const self = this;

// install SW
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Cache Opened');

            return cache.addAll(urlsTocache);
        })
    )
})


// listen for requests
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(() => {
            return fetch(e.request).catch(() => caches.match('offline.html'))
        })
    );
})

// activate the SW
self.addEventListener('activate', (e) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    e.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName)){
                    return caches.delete(cacheName);
                }
                // return cacheName;
            })
        ))
    )
})