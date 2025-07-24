const CACHE_NAME = 'bookmanager-v1';
const urlsToCache = [
  '/',
  '/livros',
  '/dashboard',
  '/usuarios/login',
  '/style.css',
  '/livros.js',
  // Bootstrap CSS (CDN será cacheado)
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  // Bootstrap JS
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
  // Font Awesome
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  // Chart.js
  'https://cdn.jsdelivr.net/npm/chart.js',
];

// Instalar o service worker
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativar o service worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Ativando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deletando cache antigo', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar requisições (estratégia Cache First para recursos estáticos)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - retorna resposta do cache
        if (response) {
          return response;
        }

        return fetch(event.request).then(response => {
          // Verifica se a resposta é válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clona a resposta
          const responseToCache = response.clone();

          // Adiciona ao cache apenas recursos específicos
          if (shouldCache(event.request.url)) {
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
          }

          return response;
        }).catch(() => {
          // Se offline, retorna página offline para navegação
          if (event.request.destination === 'document') {
            return caches.match('/offline.html');
          }
        });
      })
  );
});

// Função para determinar se deve cachear o recurso
function shouldCache(url) {
  return url.includes('/style.css') || 
         url.includes('/livros.js') ||
         url.includes('bootstrap') ||
         url.includes('font-awesome') ||
         url.includes('chart.js');
}

// Sincronização em background
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Executando sincronização em background');
    event.waitUntil(doBackgroundSync());
  }
});

// Função de sincronização
async function doBackgroundSync() {
  try {
    // Buscar dados pendentes do IndexedDB
    const pendingData = await getPendingData();
    
    for (const item of pendingData) {
      try {
        await syncDataToServer(item);
        await removePendingData(item.id);
      } catch (error) {
        console.log('Erro ao sincronizar item:', error);
      }
    }
  } catch (error) {
    console.log('Erro na sincronização:', error);
  }
}

// Push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação do BookManager!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver detalhes',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icons/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('BookManager', options)
  );
});

// Cliques em notificações
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/livros')
    );
  }
});

// Funções auxiliares para IndexedDB (implementação básica)
async function getPendingData() {
  // Implementar busca no IndexedDB
  return [];
}

async function syncDataToServer(data) {
  // Implementar sincronização com servidor
  return fetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

async function removePendingData(id) {
  // Implementar remoção do IndexedDB
  return true;
}
