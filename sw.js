/* Hafiz Cilik — service worker
 * Empat aturan, dipisah menurut jenis permintaan:
 *   shell  → cache dulu, jaringan hanya saat pasang
 *   font   → cache dulu, sekali unduh dipakai selamanya
 *   audio  → cache dulu; kalau belum ada, ambil lalu simpan
 *   teks   → tampilkan yang tersimpan, sambil memperbarui di belakang
 * Semua URL relatif supaya app tetap jalan di subfolder (GitHub Pages).
 */
const VERSION = 'v9.3';
const SHELL = 'hafiz-shell-' + VERSION;
const FONTS = 'hafiz-fonts-' + VERSION;
const TEXT = 'hafiz-text-' + VERSION;
const AUDIO = 'hafiz-audio-v1';           // sengaja tanpa VERSION: audio milik pengguna, jangan dihapus saat app diperbarui

const SHELL_FILES = [
  './',
  './index.html',
  './app.css?v=9.3',
  './app.js?v=9.3',
  './data.js?v=9.3',
  './manifest.webmanifest?v=9.3',
  './icons/favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(SHELL)
      .then(c => c.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => {
      const mine = k.startsWith('hafiz-');
      const current = [SHELL, FONTS, TEXT, AUDIO].includes(k);
      return mine && !current ? caches.delete(k) : null;
    }));
    await self.clients.claim();
  })());
});

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
  return res;
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  const fresh = fetch(req).then(res => {
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  }).catch(() => null);
  return hit || (await fresh) || new Response(JSON.stringify({ status: 'offline' }), {
    status: 503, headers: { 'Content-Type': 'application/json' }
  });
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.hostname === 'cdn.islamic.network') {
    e.respondWith(cacheFirst(req, AUDIO).catch(() => Response.error()));
    return;
  }
  if (url.hostname === 'api.alquran.cloud') {
    e.respondWith(staleWhileRevalidate(req, TEXT));
    return;
  }
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(cacheFirst(req, FONTS).catch(() => new Response('', { status: 504 })));
    return;
  }

  // permintaan halaman: kalau jaringan mati, kembalikan shell
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('./index.html')));
    return;
  }

  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req, SHELL).catch(() => Response.error()));
  }
});
