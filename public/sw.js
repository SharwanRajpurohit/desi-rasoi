/**
 * Desi Rasoi — Service Worker
 * Strategy: Network-first for HTML/API; Cache-first for static assets.
 */

const CACHE_NAME = 'desi-rasoi-v1'

const PRECACHE = [
  '/desi-rasoi/',
  '/desi-rasoi/index.html',
  '/desi-rasoi/favicon.svg',
  '/desi-rasoi/manifest.json',
]

// Install — precache shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  )
  self.skipWaiting()
})

// Activate — delete old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch — network-first with cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET, cross-origin, and devtools
  if (
    request.method !== 'GET' ||
    !url.origin.includes(self.location.origin) ||
    url.pathname.startsWith('/__')
  ) {
    return
  }

  // For navigation requests: network first, fallback to cached index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone()
          caches.open(CACHE_NAME).then((c) => c.put(request, clone))
          return res
        })
        .catch(() =>
          caches.match('/desi-rasoi/index.html').then((cached) => cached ?? Response.error())
        )
    )
    return
  }

  // For static assets: cache-first
  if (
    url.pathname.match(/\.(js|css|svg|png|jpg|webp|woff2?)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((res) => {
          const clone = res.clone()
          caches.open(CACHE_NAME).then((c) => c.put(request, clone))
          return res
        })
      })
    )
    return
  }

  // Default: network with cache fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request).then((r) => r ?? Response.error()))
  )
})
