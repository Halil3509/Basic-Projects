// var cacheName = 'cache-v1';
// var cacheFiles = ['/', '/assets/css/main.css', '/assets/scripts/main.js'];

// self.addEventListener('install', (event) => {
//     event.waitUntil(
//         caches.open(cacheName).then((cache) => {
//             console.log('Opened cache');
//             return cache.addAll(cacheFiles);
//         })
//     );
// });

// self.addEventListener('fetch', (event) => {
//     event.respondWith(
//         caches.match(event.request).then((response) => {
//             if (response) return response;
//             return fetch(event.request);
//         }
//         )
//     );
// });

// self.addEventListener("activate", (event) => {
//     console.log("Activating Service Worker...");
//     return self.clients.claim();
// });