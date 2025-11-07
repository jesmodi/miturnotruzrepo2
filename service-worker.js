// Nombre del caché (cámbialo al actualizar archivos importantes)
const CACHE_NAME = "mi-turno-truz-v1";

// Archivos que se almacenarán en caché
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/privacy.html",
  "/oauth2callback.html",
  "/terms.html",
  "/LOGO.png",
  "/fondo.png",
  "/manifest.json"
];

// Instalación del service worker (caché inicial)
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Archivos cacheados correctamente");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activación (limpiar versiones antiguas del caché)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log("Eliminando caché antiguo:", name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar peticiones de red y responder con caché si es posible
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Devuelve caché o hace fetch si no está almacenado
      return (
        response ||
        fetch(event.request).then(networkResponse => {
          // Guarda copia nueva en caché si es HTML o CSS o JS
          if (
            event.request.url.startsWith("http") &&
            (event.request.url.endsWith(".html") ||
              event.request.url.endsWith(".css") ||
              event.request.url.endsWith(".js"))
          ) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        })
      );
    })
  );
});








