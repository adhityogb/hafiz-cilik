/* HafizKu — service worker: shell, teks, font, dan audio offline. */
importScripts('./data.js');
// Suffix rilis dipisahkan dari APP_VERSION agar paket ikon bisa dipaksa refresh.
const VERSION = APP_VERSION + '-mobile-polish-zoom-v3-20260828';
const SHELL = 'hafiz-shell-' + VERSION;
const FONTS = 'hafiz-fonts-' + VERSION;
const TEXT = 'hafiz-text-' + VERSION;
const AUDIO = AUDIO_CACHE_NAME;
const LEGACY_AUDIO = ['hafiz-audio-v1'];
const SURAH_ICON_CACHE_FILES = ['./icons/surah/078-an-naba.svg','./icons/surah/079-an-naziat.svg','./icons/surah/080-abasa.svg','./icons/surah/081-at-takwir.svg','./icons/surah/082-al-infithar.svg','./icons/surah/083-al-muthaffifin.svg','./icons/surah/084-al-insyiqaq.svg','./icons/surah/085-al-buruj.svg','./icons/surah/086-ath-thariq.svg','./icons/surah/087-al-ala.svg','./icons/surah/088-al-ghasyiyah.svg','./icons/surah/089-al-fajr.svg','./icons/surah/090-al-balad.svg','./icons/surah/091-asy-syams.svg','./icons/surah/092-al-lail.svg','./icons/surah/093-adh-dhuha.svg','./icons/surah/094-asy-syarh.svg','./icons/surah/095-at-tin.svg','./icons/surah/096-al-alaq.svg','./icons/surah/097-al-qadr.svg','./icons/surah/098-al-bayyinah.svg','./icons/surah/099-az-zalzalah.svg','./icons/surah/100-al-adiyat.svg','./icons/surah/101-al-qariah.svg','./icons/surah/102-at-takatsur.svg','./icons/surah/103-al-asr.svg','./icons/surah/104-al-humazah.svg','./icons/surah/105-al-fil.svg','./icons/surah/106-quraisy.svg','./icons/surah/107-al-maun.svg','./icons/surah/108-al-kautsar.svg','./icons/surah/109-al-kafirun.svg','./icons/surah/110-an-nasr.svg','./icons/surah/111-al-masad.svg','./icons/surah/112-al-ikhlas.svg','./icons/surah/113-al-falaq.svg','./icons/surah/114-an-nas.svg'];
const SHELL_FILES = [
  './','./index.html','./app.css?v=20260828c','./app.js?v=20260828c','./data.js?v=20260828c','./manifest.webmanifest',
  './icons/favicon-48.png','./icons/apple-touch-icon.png','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png',
  ...SURAH_ICON_CACHE_FILES
];
self.addEventListener('install', event => event.waitUntil(caches.open(SHELL).then(cache => cache.addAll(SHELL_FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil((async () => {
  const keep = new Set([SHELL,FONTS,TEXT,AUDIO]);
  for (const key of await caches.keys()) {
    if (LEGACY_AUDIO.includes(key) || (key.startsWith('hafiz-') && !keep.has(key))) await caches.delete(key);
  }
  await self.clients.claim();
  const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  for (const client of windows) {
    try {
      const current = new URL(client.url);
      if (current.origin === self.location.origin) await client.navigate(client.url);
    } catch (error) {}
  }
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
