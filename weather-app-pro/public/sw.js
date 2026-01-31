const CACHE_NAME = 'weathersphere-v1'
const STATIC_CACHE = 'weathersphere-static-v1'

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/cloud.svg',
  '/manifest.json'
]

// API base URL pattern to identify API requests
const API_PATTERN = /https?:\/\/api\.openweathermap\.org\//

// Install event - cache static assets only
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Keep current caches, delete old ones
          if (cacheName !== STATIC_CACHE && cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event - network-first for API, cache-first for static
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // For API requests - always use network (no caching)
  if (API_PATTERN.test(url.href)) {
    event.respondWith(
      fetch(request).catch(() => {
        // Return a generic error response if network fails
        return new Response(
          JSON.stringify({ error: 'Network error - please check your connection' }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      })
    )
    return
  }

  // For static assets - cache first, network fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version for static assets
        return cachedResponse
      }

      // Clone the request for fetching
      const fetchRequest = request.clone()

      return fetch(fetchRequest).then((response) => {
        // Don't cache if not successful or not basic type
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        // Clone the response for caching
        const responseToCache = response.clone()

        caches.open(STATIC_CACHE).then((cache) => {
          cache.put(request, responseToCache)
        })

        return response
      }).catch(() => {
        // Network failed, try to return index.html for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/index.html')
        }
      })
    })
  )
})
