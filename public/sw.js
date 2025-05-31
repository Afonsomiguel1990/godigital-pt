// Service Worker para GoDigital.pt
// Cache estratégico para melhor performance e funcionalidade offline

const CACHE_NAME = 'godigital-pt-v1.1';
const STATIC_CACHE = 'godigital-static-v1.1';
const DYNAMIC_CACHE = 'godigital-dynamic-v1.1';

// Recursos essenciais para cache
const STATIC_ASSETS = [
  '/',
  '/sobre/',
  '/servicos/',
  '/blog/',
  '/contacto/',
  '/manifest.json',
  '/favicon.svg',
  '/fonts/atkinson-regular.woff',
  '/fonts/atkinson-bold.woff'
];

// URLs para cache dinâmico
const CACHE_DYNAMIC_LIMIT = 50;

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Cache aberto');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Recursos em cache');
        return self.skipWaiting();
      })
  );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Ativando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Removendo cache antigo', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Ativado');
      return self.clients.claim();
    })
  );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Se existe em cache, retorna
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Senão, faz request e cache dinâmico
        return fetch(event.request)
          .then((response) => {
            // Verifica se é uma resposta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone da resposta para cache
            const responseToCache = response.clone();
            
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(event.request, responseToCache);
                
                // Limitar cache dinâmico
                limitCacheSize(DYNAMIC_CACHE, CACHE_DYNAMIC_LIMIT);
              });

            return response;
          })
          .catch(() => {
            // Offline fallback
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});

// Função para limitar tamanho do cache
function limitCacheSize(name, size) {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(() => {
          limitCacheSize(name, size);
        });
      }
    });
  });
}

// Sync em background (para quando voltar online)
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);
});

// Push notifications (futuro)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push recebido');
  // Implementar notificações push se necessário
}); 