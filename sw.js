/* Hafizku — service worker: shell, teks, font, dan audio offline. */
importScripts('./data.js');

const VERSION = APP_VERSION;
const SHELL = 'hafiz-shell-' + VERSION;
const FONTS = 'hafiz-fonts-' + VERSION;
const TEXT = 'hafiz-text-' + VERSION;
const AUDIO = 'hafiz-audio-v1'; // audio pilihan pengguna bertahan lintas versi

const SHELL_FILES = [
  './', './index.html', './app.css', './app.js', './data.js', './manifest.webmanifest',
  './icons/favicon.svg', './icons/apple-touch-icon.png', './icons/icon-192.png',
  './icons/icon-512.png', './icons/icon-maskable-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL).then(cache => cache.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keep = new Set([SHELL, FONTS, TEXT, AUDIO]);
    const keys = await caches.keys();
    await Promise.all(keys.map(key => key.startsWith('hafiz-') && !keep.has(key) ? caches.delete(key) : null));
    await self.clients.claim();
  })());
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request, { ignoreVary: true });
  if (hit) return hit;
  const response = await fetch(request);
  if (response && (response.ok || response.type === 'opaque')) await cache.put(request.url, response.clone());
  return response;
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request, { ignoreVary: true });
  const fresh = fetch(request).then(async response => {
    if (response && response.ok) await cache.put(request, response.clone());
    return response;
  }).catch(() => null);
  return hit || await fresh || new Response(JSON.stringify({ status:'offline' }), { status:503, headers:{'Content-Type':'application/json'} });
}

async function rangeFromCached(request, response) {
  const range = request.headers.get('range');
  if (!range || response.type === 'opaque') return response;
  const match = /bytes=(\d+)-(\d*)/.exec(range);
  if (!match) return response;
  const body = await response.arrayBuffer();
  const start = Number(match[1]);
  const requestedEnd = match[2] ? Number(match[2]) : body.byteLength - 1;
  const end = Math.min(requestedEnd, body.byteLength - 1);
  if (start > end) return new Response(null, { status: 416 });
  const headers = new Headers(response.headers);
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Content-Range', `bytes ${start}-${end}/${body.byteLength}`);
  headers.set('Content-Length', String(end - start + 1));
  return new Response(body.slice(start, end + 1), { status: 206, statusText: 'Partial Content', headers });
}

async function audioCacheFirst(request) {
  const cache = await caches.open(AUDIO);
  const hit = await cache.match(request.url, { ignoreVary: true });
  if (hit) return rangeFromCached(request, hit);
  const response = await fetch(request);
  // Jangan menyimpan respons Range parsial sebagai seolah-olah satu file penuh.
  if (response && !request.headers.has('range') && (response.ok || response.type === 'opaque')) {
    await cache.put(request.url, response.clone());
  }
  return response;
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (AUDIO_HOSTS.includes(url.hostname)) {
    event.respondWith(audioCacheFirst(request).catch(() => Response.error()));
    return;
  }
  if (url.hostname === 'api.alquran.cloud') {
    event.respondWith(staleWhileRevalidate(request, TEXT));
    return;
  }
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, FONTS).catch(() => new Response('', {status:504})));
    return;
  }
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('./index.html')));
    return;
  }
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request, SHELL).catch(() => Response.error()));
  }
});
