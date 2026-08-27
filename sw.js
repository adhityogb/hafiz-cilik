/* HafizKu — service worker: shell, teks, font, dan audio offline. */
importScripts('./data.js');
// Tambahkan suffix rilis agar perubahan shell (termasuk app.js) tidak tertahan cache lama.
const VERSION = APP_VERSION + '-juz30-icons-v2-20260828';
const SHELL = 'hafiz-shell-' + VERSION;
const FONTS = 'hafiz-fonts-' + VERSION;
const TEXT = 'hafiz-text-' + VERSION;
const AUDIO = AUDIO_CACHE_NAME;
const LEGACY_AUDIO = ['hafiz-audio-v1'];
const SHELL_FILES = ['./','./index.html','./app.css','./app.js','./data.js','./manifest.webmanifest','./icons/favicon-48.png','./icons/apple-touch-icon.png','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png'];
self.addEventListener('install', event => event.waitUntil(caches.open(SHELL).then(cache => cache.addAll(SHELL_FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil((async () => {
  const keep = new Set([SHELL,FONTS,TEXT,AUDIO]);
  for (const key of await caches.keys()) {
    if (LEGACY_AUDIO.includes(key) || (key.startsWith('hafiz-') && !keep.has(key))) await caches.delete(key);
  }
  await self.clients.claim();
})()));
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request, {ignoreVary:true});
  if (hit) return hit;
  const response = await fetch(request);
  if (response && (response.ok || response.type === 'opaque')) await cache.put(request.url, response.clone());
  return response;
}
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request, {ignoreVary:true});
  const fresh = fetch(request).then(async response => { if (response && response.ok) await cache.put(request,response.clone()); return response; }).catch(() => null);
  return hit || await fresh || new Response(JSON.stringify({status:'offline'}), {status:503,headers:{'Content-Type':'application/json'}});
}
async function rangeFromCached(request, response) {
  const range = request.headers.get('range');
  if (!range) return response;
  if (!response || response.type === 'opaque' || response.status !== 200) throw new Error('invalid cached audio');
  const body = await response.arrayBuffer();
  const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (!match) return new Response(null,{status:416,headers:{'Content-Range':`bytes */${body.byteLength}`}});
  let start,end;
  if (match[1] === '') {
    const suffix = Number(match[2]);
    if (!Number.isFinite(suffix) || suffix <= 0) return new Response(null,{status:416});
    start = Math.max(0, body.byteLength - suffix); end = body.byteLength - 1;
  } else {
    start = Number(match[1]); end = match[2] === '' ? body.byteLength - 1 : Math.min(Number(match[2]),body.byteLength - 1);
  }
  if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || start >= body.byteLength || start > end) return new Response(null,{status:416,headers:{'Content-Range':`bytes */${body.byteLength}`}});
  const headers = new Headers(response.headers);
  headers.set('Accept-Ranges','bytes'); headers.set('Content-Range',`bytes ${start}-${end}/${body.byteLength}`); headers.set('Content-Length',String(end-start+1));
  return new Response(body.slice(start,end+1),{status:206,statusText:'Partial Content',headers});
}
async function audioCacheFirst(request) {
  const cache = await caches.open(AUDIO);
  const hit = await cache.match(request.url,{ignoreVary:true});
  if (hit) {
    if (hit.type === 'opaque' || hit.status !== 200) await cache.delete(request.url);
    else return rangeFromCached(request,hit);
  }
  return fetch(request);
}
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (AUDIO_HOSTS.includes(url.hostname)) { event.respondWith(audioCacheFirst(request).catch(() => Response.error())); return; }
  if (url.hostname === 'api.alquran.cloud') { event.respondWith(staleWhileRevalidate(request,TEXT)); return; }
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') { event.respondWith(cacheFirst(request,FONTS).catch(() => new Response('',{status:504}))); return; }
  if (request.mode === 'navigate') { event.respondWith(fetch(request).catch(() => caches.match('./index.html'))); return; }
  if (url.origin === self.location.origin) event.respondWith(cacheFirst(request,SHELL).catch(() => Response.error()));
});