// GAMBITO · service worker: app disponible sin conexión tras la primera visita
const VERSION = "gambito-v7";
const APP = ["./", "index.html", "manifest.webmanifest", "vendor/sql-wasm.js", "vendor/sql-wasm.wasm",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png",
  "vendor/stockfish/stockfish-18-lite-single.js"];
const MOTORES = "gambito-motores"; // el .wasm de Stockfish (7 MB) se guarda al primer uso, no al instalar

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(APP)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== VERSION && k !== "gambito-fuentes" && k !== MOTORES).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET") return;
  // Página: primero la red (para recibir actualizaciones); sin conexión, la copia guardada
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(r => {
      const copy = r.clone(); caches.open(VERSION).then(c => c.put("index.html", copy)); return r;
    }).catch(() => caches.match("index.html")));
    return;
  }
  // Fuentes de Google: se guardan la primera vez y luego se sirven desde la caché
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(caches.open("gambito-fuentes").then(c => c.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok || r.type === "opaque") c.put(req, r.clone()); return r;
    }))));
    return;
  }
  // Motor Stockfish: se guarda al primer uso y luego funciona sin conexión
  if (url.origin === location.origin && url.pathname.includes("/vendor/stockfish/") && url.pathname.endsWith(".wasm")) {
    e.respondWith(caches.open(MOTORES).then(c => c.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok) c.put(req, r.clone()); return r;
    }))));
    return;
  }
  // Archivos propios: caché primero
  if (url.origin === location.origin) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
  }
});
