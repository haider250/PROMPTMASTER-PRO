/**
 * Service Worker for PromptMaster Pro PWA
 * Handles offline capabilities, caching, and background sync
 */

const CACHE_NAME = 'promptmaster-pro-v1.0.0';
const RUNTIME_CACHE = 'promptmaster-runtime-v1.0.0';
const OFFLINE_CACHE = 'promptmaster-offline-v1.0.0';

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// API endpoints that should be cached
const API_CACHE_PATTERNS = [
  /^\/api\/prompts/,
  /^\/api\/analytics/,
  /^\/api\/models/
];

// Background sync tags
const SYNC_TAGS = {
  ANALYTICS_SYNC: 'analytics-sync',
  PROMPT_SYNC: 'prompt-sync',
  OFFLINE_ACTIONS: 'offline-actions'
};

/**
 * Service Worker Installation
 */
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache critical resources
      caches.open(CACHE_NAME).then(cache => {
        console.log('Caching critical resources');
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

/**
 * Service Worker Activation
 */
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      cleanupOldCaches(),
      
      // Take control of all clients immediately
      self.clients.claim(),
      
      // Initialize offline storage
      initializeOfflineStorage()
    ])
  );
});

/**
 * Fetch Event Handler
 */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Handle different types of requests
  if (isAPIRequest(url)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else if (isStaticResource(request)) {
    event.respondWith(handleStaticResource(request));
  } else {
    event.respondWith(handleOtherRequests(request));
  }
});

/**
 * Background Sync Event Handler
 */
self.addEventListener('sync', event => {
  console.log('Background sync triggered:', event.tag);
  
  switch (event.tag) {
    case SYNC_TAGS.ANALYTICS_SYNC:
      event.waitUntil(syncAnalyticsData());
      break;
    case SYNC_TAGS.PROMPT_SYNC:
      event.waitUntil(syncPromptData());
      break;
    case SYNC_TAGS.OFFLINE_ACTIONS:
      event.waitUntil(processOfflineActions());
      break;
    default:
      console.log('Unknown sync tag:', event.tag);
  }
});

/**
 * Push Notification Event Handler
 */
self.addEventListener('push', event => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/icons/icon-192x192.png',
      badge: data.badge || '/icons/badge-72x72.png',
      tag: data.tag || 'promptmaster-notification',
      data: data.data,
      actions: data.actions || [],
      requireInteraction: data.requireInteraction || false,
      silent: data.silent || false
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error('Error handling push notification:', error);
  }
});

/**
 * Notification Click Event Handler
 */
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  const targetUrl = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clients => {
        // Check if app is already open
        for (const client of clients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            client.postMessage({ type: 'NOTIFICATION_CLICKED', data: event.notification.data });
            return;
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

/**
 * Message Event Handler
 */
self.addEventListener('message', event => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'CACHE_RESOURCE':
      cacheResource(data.url);
      break;
    case 'CLEAR_CACHE':
      clearCache(data.cacheName);
      break;
    case 'GET_CACHE_STATUS':
      getCacheStatus().then(status => {
        event.ports[0].postMessage(status);
      });
      break;
    case 'OFFLINE_ACTION':
      storeOfflineAction(data);
      break;
    default:
      console.log('Unknown message type:', type);
  }
});

/**
 * Helper Functions
 */

function isAPIRequest(url) {
  return url.pathname.startsWith('/api/') || 
         url.hostname.includes('api.') ||
         API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

function isStaticResource(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/);
}

async function handleAPIRequest(request) {
  const cacheStrategy = getAPICacheStrategy(request.url);
  
  switch (cacheStrategy) {
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirstStrategy(request, OFFLINE_CACHE);
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidateStrategy(request, OFFLINE_CACHE);
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirstStrategy(request, OFFLINE_CACHE);
    default:
      return networkOnlyStrategy(request);
  }
}

function getAPICacheStrategy(url) {
  const urlPath = new URL(url).pathname;
  
  // Analytics endpoints - network first with offline fallback
  if (urlPath.includes('/analytics')) {
    return CACHE_STRATEGIES.NETWORK_FIRST;
  }
  
  // Prompt endpoints - stale while revalidate
  if (urlPath.includes('/prompts')) {
    return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
  }
  
  // Default strategy
  return CACHE_STRATEGIES.NETWORK_FIRST;
}

async function handleNavigationRequest(request) {
  try {
    // Try network first for navigation
    const networkResponse = await fetch(request);
    
    // Cache the response
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    return caches.match('/offline.html') || 
           new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

async function handleStaticResource(request) {
  // Cache first for static resources
  return cacheFirstStrategy(request, CACHE_NAME);
}

async function handleOtherRequests(request) {
  // Default to network first for other requests
  return networkFirstStrategy(request, RUNTIME_CACHE);
}

/**
 * Cache Strategies
 */

async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    return new Response('Network error', { status: 503 });
  }
}

async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Network error', { status: 503 });
  }
}

async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  const networkResponsePromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);
  
  // Return cached response immediately if available, otherwise wait for network
  return cachedResponse || networkResponsePromise || new Response('Network error', { status: 503 });
}

async function networkOnlyStrategy(request) {
  try {
    return await fetch(request);
  } catch (error) {
    return new Response('Network error', { status: 503 });
  }
}

/**
 * Background Sync Functions
 */

async function syncAnalyticsData() {
  try {
    // Get pending analytics from IndexedDB
    const pendingAnalytics = await getPendingAnalytics();
    
    if (pendingAnalytics.length === 0) return;
    
    // Send to server
    const response = await fetch('/api/analytics/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: pendingAnalytics })
    });
    
    if (response.ok) {
      // Clear synced analytics
      await clearPendingAnalytics();
      console.log('Analytics synced successfully');
    }
  } catch (error) {
    console.error('Analytics sync failed:', error);
  }
}

async function syncPromptData() {
  try {
    // Get pending prompt updates
    const pendingPrompts = await getPendingPrompts();
    
    for (const prompt of pendingPrompts) {
      try {
        const response = await fetch(`/api/prompts/${prompt.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(prompt.data)
        });
        
        if (response.ok) {
          await removePendingPrompt(prompt.id);
        }
      } catch (error) {
        console.error('Prompt sync failed for:', prompt.id, error);
      }
    }
  } catch (error) {
    console.error('Prompt sync failed:', error);
  }
}

async function processOfflineActions() {
  try {
    const actions = await getOfflineActions();
    
    for (const action of actions) {
      try {
        await executeOfflineAction(action);
        await removeOfflineAction(action.id);
      } catch (error) {
        console.error('Offline action failed:', action, error);
      }
    }
  } catch (error) {
    console.error('Offline actions processing failed:', error);
  }
}

/**
 * Offline Storage Functions
 */

async function initializeOfflineStorage() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PromptMasterPro-Offline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores
      if (!db.objectStoreNames.contains('prompts')) {
        db.createObjectStore('prompts', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('analytics')) {
        db.createObjectStore('analytics', { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains('offlineActions')) {
        db.createObjectStore('offlineActions', { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains('pendingSync')) {
        db.createObjectStore('pendingSync', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function storeOfflineAction(action) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PromptMasterPro-Offline', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['offlineActions'], 'readwrite');
      const store = transaction.objectStore('offlineActions');
      
      const addRequest = store.add({
        ...action,
        timestamp: Date.now(),
        retries: 0
      });
      
      addRequest.onsuccess = () => resolve(addRequest.result);
      addRequest.onerror = () => reject(addRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

function getOfflineActions() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PromptMasterPro-Offline', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['offlineActions'], 'readonly');
      const store = transaction.objectStore('offlineActions');
      
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

function removeOfflineAction(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PromptMasterPro-Offline', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['offlineActions'], 'readwrite');
      const store = transaction.objectStore('offlineActions');
      
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

/**
 * Cache Management Functions
 */

function cacheResource(url) {
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return caches.open(RUNTIME_CACHE).then(cache => {
          cache.put(url, response.clone());
          return response;
        });
      }
      throw new Error('Resource not cacheable');
    })
    .catch(error => {
      console.error('Failed to cache resource:', url, error);
      throw error;
    });
}

function clearCache(cacheName) {
  return caches.delete(cacheName);
}

async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const status = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    status[cacheName] = {
      count: keys.length,
      resources: keys.map(req => req.url)
    };
  }
  
  return status;
}

async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const currentCacheNames = [CACHE_NAME, RUNTIME_CACHE, OFFLINE_CACHE];
  
  const deletePromises = cacheNames
    .filter(cacheName => !currentCacheNames.includes(cacheName))
    .map(cacheName => caches.delete(cacheName));
  
  return Promise.all(deletePromises);
}

async function executeOfflineAction(action) {
  switch (action.type) {
    case 'ANALYTICS_EVENT':
      // Analytics events are handled by syncAnalyticsData
      break;
    case 'PROMPT_UPDATE':
      // Prompt updates are handled by syncPromptData
      break;
    case 'USER_ACTION':
      // Other user actions
      console.log('Executing user action:', action);
      break;
    default:
      console.log('Unknown offline action type:', action.type);
  }
}

// Placeholder functions for analytics and prompt sync
async function getPendingAnalytics() {
  return [];
}

async function clearPendingAnalytics() {
  // Clear pending analytics
}

async function getPendingPrompts() {
  return [];
}

async function removePendingPrompt(id) {
  // Remove pending prompt
}

// Export for use in other parts of the service worker
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CACHE_NAME,
    RUNTIME_CACHE,
    OFFLINE_CACHE,
    CACHE_STRATEGIES,
    SYNC_TAGS
  };
}