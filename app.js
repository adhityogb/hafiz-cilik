/* ==========================================================================
   Hafizku — app.js
   Vanilla JS, tanpa framework. Tiga hal yang paling menentukan di sini:
   1. SATU objek Audio yang dibuka pada sentuhan pertama, lalu hanya .src-nya
      yang diganti. Ini yang membuat "Putar semua" tidak diblokir Safari iOS.
   2. Daftar ayat dibangun dari data lokal, jadi langsung muncul tanpa jaringan.
      Teks Arab/latin/arti menyusul dan disimpan untuk pemakaian berikutnya.
   3. Semua state pemutar lewat satu pintu (stopAll) supaya tombol dan kartu
      tidak pernah menunjukkan keadaan yang berbeda dari audionya.
   ========================================================================== */
'use strict';

const AUDIO_CACHE = AUDIO_CACHE_NAME;
const LEGACY_AUDIO_CACHES = ['hafiz-audio-v1'];
const REPEATS = [1, 3, 5, 10];
const GAPS = [0, 1, 2, 4];
const SPEEDS = [0.75, 0.9, 1, 1.15];
const $ = id => document.getElementById(id);

const FEATURES = {
  memorizationMarker: false
};

/* ---------- penyimpanan yang tidak pernah melempar error ---------- */
const store = {
  mem: {},
  get(k, fb) {
    try { const v = localStorage.getItem('hafiz:' + k); return v === null ? fb : JSON.parse(v); }
    catch (e) { return k in this.mem ? this.mem[k] : fb; }
  },
  set(k, v) {
    this.mem[k] = v;
    try { localStorage.setItem('hafiz:' + k, JSON.stringify(v)); } catch (e) { /* mode privat: cukup di memori */ }
  },
  del(k) {
    delete this.mem[k];
    try { localStorage.removeItem('hafiz:' + k); } catch (e) {}
  }
};

const state = {
  level: store.get('level', '1'),
  hideText: store.get('hideText', false),
  focus: new Set(store.get('focus', [])),
  markers: store.get('markers', {}),
  surah: null,
  verses: [],          // [{no, global, ar, latin, id}]
  repeat: store.get('repeat', 3),
  gap: store.get('gap', 1),
  speed: store.get('speed', 1),
  reciter: store.get('reciter', RECITERS[0].id),
  stars: store.get('stars', 0),
  saved: new Set(),    // nomor ayat global yang audionya sudah tersimpan
  playing: null,       // {idx, rep, target, chain, sourceIndex}
  timer: null
};

/* ---------- audio: satu elemen, diputar langsung dari gesture pengguna ---------- */
let audio = null;
let playbackGeneration = 0;
let activeAudioUrl = '';

function everyAyahFolder(reciter) {
  const folders = AUDIO_CONFIG.everyayah.folders;
  return folders[reciter] || folders['ar.alafasy'];
}

function verseCode(surahId, ayahNo) {
  return String(surahId).padStart(3, '0') + String(ayahNo).padStart(3, '0');
}

function audioCandidates(surahId, ayahNo, reciter = state.reciter) {
  const code = verseCode(surahId, ayahNo);
  const primary = AUDIO_CONFIG.everyayah;
  const foundation = AUDIO_CONFIG.quranFoundation;
  const urls = [
    `https://${primary.host}${primary.basePath}/${everyAyahFolder(reciter)}/${code}.mp3`
  ];
  if (reciter !== 'ar.alafasy') {
    urls.push(`https://${primary.host}${primary.basePath}/${everyAyahFolder('ar.alafasy')}/${code}.mp3`);
  }
  const quranProject = AUDIO_CONFIG.quranProject;
  urls.push(`https://${quranProject.host}${quranProject.basePath}/${surahId}_${ayahNo}.mp3`);
  urls.push(`https://${foundation.host}${foundation.basePath}/${code}.mp3`);
  return [...new Set(urls)];
}

function makeAudio() {
  if (audio) return audio;
  audio = new Audio();
  audio.preload = 'auto';
  audio.addEventListener('ended', onEnded);
  audio.addEventListener('error', onAudioError);
  audio.addEventListener('stalled', () => audioDiagnostics('stalled'));
  return audio;
}

function audioDiagnostics(reason, error) {
  const mediaError = audio && audio.error;
  console.warn('[Hafizku audio]', reason, {
    error: error ? { name: error.name, message: error.message } : null,
    mediaError: mediaError ? { code: mediaError.code, message: mediaError.message || '' } : null,
    networkState: audio ? audio.networkState : null,
    readyState: audio ? audio.readyState : null,
    currentSrc: audio ? audio.currentSrc : '',
    expectedSrc: activeAudioUrl,
    online: navigator.onLine,
    standalone: window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
  });
}

function disposeAudio() {
  if (!audio) return;
  try { audio.pause(); } catch (error) {}
  audio.removeEventListener('ended', onEnded);
  audio.removeEventListener('error', onAudioError);
  audio = null;
  activeAudioUrl = '';
}

/* ---------- utilitas ---------- */
function icon(id, cls) {
  return `<svg class="${cls || 'ico'}" aria-hidden="true"><use href="#${id}"></use></svg>`;
}
function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

const BASMALAH_AR = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
const ARABIC_MARK_RE = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/u;


function stripBasmalahArabic(text) {
  const source = String(text || '').trim();
  const target = 'بسماللهالرحمنالرحيم';
  let i = 0;
  let t = 0;
  const isIgnorable = ch => /\s/u.test(ch) || ARABIC_MARK_RE.test(ch) || ch === 'ـ';
  const normalizedLetter = ch => 'ٱأإآ'.includes(ch) ? 'ا' : ch;

  while (t < target.length) {
    while (i < source.length && isIgnorable(source[i])) i++;
    if (i >= source.length || normalizedLetter(source[i]) !== target[t]) return source;
    i++;
    t++;
  }
  while (i < source.length && isIgnorable(source[i])) i++;
  return source.slice(i).trim();
}

function toast(msg) {
  const t = $('toast');
  $('toastText').textContent = msg;
  t.classList.add('is-on');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('is-on'), 2800);
}

/* ---------- langit bintang (elemen khas app ini) ---------- */
const SKY_SLOTS = 24;
function renderSky() {
  const sky = $('sky');
  const shown = state.stars % SKY_SLOTS;
  const moons = Math.floor(state.stars / SKY_SLOTS);
  sky.querySelectorAll('.sky__star').forEach(n => n.remove());
  for (let i = 0; i < shown; i++) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('class', 'sky__star');
    s.setAttribute('aria-hidden', 'true');
    // posisi ditentukan dari indeks, bukan acak, supaya bintang tidak berpindah
    s.style.left = (6 + ((i * 37) % 108)) + 'px';
    s.style.top = (7 + ((i * 19) % 34)) + 'px';
    s.style.animationDelay = (i % 7) * 0.3 + 's';
    s.innerHTML = '<use href="#i-star"></use>';
    sky.appendChild(s);
  }
  $('skyCount').textContent = state.stars;
  sky.setAttribute('aria-label',
    `Langit bintang, ${state.stars} bintang terkumpul` + (moons ? `, ${moons} langit penuh` : ''));
}
function addStar(n) {
  state.stars += n;
  store.set('stars', state.stars);
  renderSky();
  if (state.stars > 0 && state.stars % SKY_SLOTS === 0) toast('Langitmu penuh bintang! Masyaallah');
}

/* ---------- layar 1: daftar surah ---------- */
function renderLevels() {
  const focusChip = `<button class="chip chip--focus" type="button" data-level="focus" aria-pressed="${state.level === 'focus'}">Target Hafalan <small>${state.focus.size || 0} surah</small></button>`;
  $('levels').innerHTML = focusChip + LEVELS.map(l => `
    <button class="chip" type="button" data-level="${l.key}" aria-pressed="${l.key === state.level}">
      ${esc(l.label)} <small>${esc(l.hint)}</small>
    </button>`).join('');
  requestAnimationFrame(() => {
    const active = $('levels').querySelector('[aria-pressed="true"]');
    if (active) active.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'auto' });
  });
}


function getMarker(surahId) {
  return +((state.markers && state.markers[surahId]) || 0);
}
function setMarker(surahId, ayahNo) {
  state.markers = state.markers || {};
  state.markers[surahId] = ayahNo;
  store.set('markers', state.markers);
}
function clearMarker(surahId) {
  state.markers = state.markers || {};
  delete state.markers[surahId];
  store.set('markers', state.markers);
}
function renderMarkerSummary() {
  if (!FEATURES.memorizationMarker) {
    const panel = $('markerPanel');
    if (panel) panel.classList.add('hidden');
    return;
  }
  const text = $('markerText');
  const btn = $('btnClearMarker');
  if (!text || !btn || !state.surah) return;
  const ayah = getMarker(state.surah.id);
  const panel = $('markerPanel');
  if (ayah) {
    text.textContent = `Ayat ${ayah}`;
    btn.classList.remove('hidden');
    if (panel) panel.classList.remove('hidden');
  } else {
    text.textContent = '';
    btn.classList.add('hidden');
    if (panel) panel.classList.add('hidden');
  }
}

function surahSaved(s) {
  for (let i = 0; i < s.n; i++) if (!state.saved.has(s.start + i)) return false;
  return s.n > 0;
}

function renderGrid() {
  const level = LEVELS.find(l => l.key === state.level) || LEVELS[0];
  const list = state.level === 'focus' ? SURAHS.filter(s => state.focus.has(s.id)) : SURAHS.filter(level.test);
  const hafal = new Set(store.get('hafal', []));

  if (!list.length && state.level === 'focus') {
    $('grid').innerHTML = `<div class="empty-focus"><b>Belum ada target hafalan</b><span>Pilih surah di Pengaturan → Target Hafalan.</span></div>`;
    return;
  }

  $('grid').innerHTML = list.map(s => `
    <button class="card card--${s.sky}" type="button" data-id="${s.id}">
      <span class="card__head">
        ${icon('s-' + s.sym, 'card__sym')}
        <span class="card__grow"></span>
        <span class="card__badges">
          ${hafal.has(s.id) ? `<span class="card__badge">${icon('i-check')}<span class="sr-only">Sudah pernah selesai</span></span>` : ''}
          ${FEATURES.memorizationMarker && getMarker(s.id) ? `<span class="card__badge card__badge--marker">${icon('i-bookmark')}<span>Ayat ${getMarker(s.id)}</span></span>` : ''}
          ${surahSaved(s) ? `<span class="card__badge">${icon('i-saved')}<span class="sr-only">Tersimpan, bisa tanpa internet</span></span>` : ''}
        </span>
        <span class="card__no">${s.id}</span>
      </span>
      <span class="card__ar" dir="rtl" lang="ar">${esc(s.ar)}</span>
      <span class="card__name">${esc(s.name)}</span>
      <span class="card__meta">${s.n} AYAT</span>
      <span class="card__meaning">${esc(s.meaning)}</span>
    </button>`).join('');
}

/* ---------- layar 2: pemutar ---------- */
function openSurah(s) {
  stopAll();
  state.surah = s;
  state.verses = Array.from({ length: s.n }, (_, i) => ({ no: i + 1, global: s.start + i }));

  const view = $('viewSurah');
  view.classList.remove('card--dawn', 'card--sun', 'card--sky', 'card--garden', 'card--dusk', 'card--night');
  view.classList.add('card--' + s.sky);
  $('hero').className = 'hero card--' + s.sky;
  $('heroSym').innerHTML = `<use href="#s-${s.sym}"></use>`;
  $('heroAr').textContent = s.ar;
  $('heroName').textContent = s.name;
  $('heroMeta').textContent = `${s.n} ayat · ${s.meaning}`;

  renderSegs();
  renderVerses();
  renderMarkerSummary();
  updateSaveBtn();

  $('viewHome').classList.add('hidden');
  $('viewSurah').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'auto' });
  $('btnBack').focus();

  loadText(s);
}

function backHome() {
  stopAll();
  $('viewSurah').classList.add('hidden');
  $('viewHome').classList.remove('hidden');
  renderGrid();
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function renderSegs() {
  $('segRepeat').innerHTML = REPEATS.map(r => `
    <button class="chip" type="button" data-repeat="${r}" aria-pressed="${r === state.repeat}">${r}×</button>`).join('');
  $('segGap').innerHTML = GAPS.map(g => `
    <button class="chip" type="button" data-gap="${g}" aria-pressed="${g === state.gap}">${g === 0 ? 'Tanpa' : g + ' dtk'}</button>`).join('');
  $('segSpeed').innerHTML = SPEEDS.map(v => `
    <button class="chip" type="button" data-speed="${v}" aria-pressed="${v === state.speed}">${v + '×'}</button>`).join('');
  const sum = $('tuneSum');
  if (sum) sum.textContent = `${state.repeat}× · ${state.gap === 0 ? 'tanpa jeda' : state.gap + ' dtk jeda'}`;
}

function renderVerses() {
  const hasText = state.verses.some(v => v.ar);
  const wrap = $('ayat');
  const marker = state.surah ? getMarker(state.surah.id) : 0;
  const basmalahHtml = state.surah && state.surah.id !== 9
    ? `<div class="basmalah" dir="rtl" lang="ar"><span class="basmalah__ar">${BASMALAH_AR}</span></div>`
    : '';

  if (state.hideText) {
    wrap.className = 'ayat ayat--numbers';
    wrap.innerHTML = state.verses.map((v, i) => `
      <div class="ayah-card ${marker === v.no ? 'is-marked' : ''}">
        <button class="ayah-number" type="button" data-idx="${i}" id="ayah${i}" aria-label="Putar ayat ${v.no}">
          <span class="ayah__no">${v.no}</span>
          <span class="ayah-number__label">Ayat ${v.no}<small>Tekan untuk dengar</small></span>
          <span class="ayah-number__play" data-cue="${i}">${icon('i-play')}</span>
          <span class="sr-only" data-status="${i}">Ayat ${v.no}</span>
        </button>
        <button class="ayah-mark-btn ${marker === v.no ? 'is-on' : ''}" type="button" data-mark="${v.no}" aria-pressed="${marker === v.no}" aria-label="Tandai ayat ${v.no} sebagai hafalan saat ini">
          ${icon('i-bookmark')}
        </button>
      </div>`).join('');
    return;
  }

  wrap.className = 'ayat' + (hasText ? ' ayat--full' : '');
  wrap.innerHTML = basmalahHtml + state.verses.map((v, i) => `
    <div class="ayah-wrap ${marker === v.no ? 'is-marked' : ''}">
      <button class="ayah" type="button" data-idx="${i}" id="ayah${i}">
        <span class="ayah__no" aria-hidden="true">${v.no}</span>
        <span class="ayah__body">
          <span class="sr-only">Ayat ${v.no}. </span>
          ${v.ar ? `<span class="ayah__ar" dir="rtl" lang="ar">${esc(v.ar)}</span>` : ''}
          ${v.latin ? `<span class="ayah__latin">${esc(v.latin)}</span>` : ''}
          ${v.id ? `<span class="ayah__id">${esc(v.id)}</span>` : ''}
          <span class="ayah__status" data-status="${i}">${v.ar ? '' : 'Ketuk untuk dengar'}</span>
        </span>
        ${icon('i-play', 'ayah__cue')}
      </button>
      <button class="ayah-mark-btn ${marker === v.no ? 'is-on' : ''}" type="button" data-mark="${v.no}" aria-pressed="${marker === v.no}" aria-label="Tandai ayat ${v.no} sebagai hafalan saat ini">
        ${icon('i-bookmark')}
        <span>${marker === v.no ? 'Ditandai' : 'Tandai'}</span>
      </button>
    </div>`).join('');
  wrap.querySelectorAll('.ayah').forEach((el, i) => {
    const cue = el.querySelector('.ayah__cue');
    const box = document.createElement('span');
    box.className = 'ayah__cue';
    box.dataset.cue = i;
    box.innerHTML = icon('i-play');
    cue.replaceWith(box);
  });
}


/* ---------- teks ayat ---------- */
const EDITIONS = 'quran-uthmani,en.transliteration,id.indonesian';

async function loadText(s) {
  const cached = store.get('text:' + s.id, null);
  if (cached && cached.length === s.n) {
    applyText(cached);
    return;
  }
  setStatusAll('Mengambil teks ayat…');
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${s.id}/editions/${EDITIONS}`);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    const eds = json.data;
    const byId = {};
    eds.forEach(e => { byId[e.edition.identifier] = e.ayahs; });
    const ar = byId['quran-uthmani'] || [];
    const tl = byId['en.transliteration'] || [];
    const id = byId['id.indonesian'] || [];

    // Pemeriksaan integritas saja. Audio memakai surah:ayat, dan data lokal
    // tidak pernah diubah berdasarkan respons API.
    if (ar[0] && ar[0].number !== s.start) {
      console.warn('Integritas data: nomor global API berbeda dari data lokal.', { api: ar[0].number, lokal: s.start, surah: s.id });
    }

    const rows = state.verses.map((v, i) => ({
      ar: ar[i] ? (i === 0 ? stripBasmalahArabic(ar[i].text) : ar[i].text) : '',
      latin: tl[i] ? tl[i].text : '',
      id: id[i] ? id[i].text : ''
    }));
    store.set('text:' + s.id, rows);
    if (state.surah && state.surah.id === s.id) applyText(rows);
  } catch (e) {
    setStatusAll(navigator.onLine ? 'Teks belum bisa diambil — suaranya tetap bisa diputar'
                                  : 'Sedang tanpa internet — teks menyusul nanti');
  }
}

function applyText(rows) {
  state.verses.forEach((v, i) => {
    if (!rows[i]) return;
    v.ar = i === 0 ? stripBasmalahArabic(rows[i].ar) : rows[i].ar; v.latin = rows[i].latin; v.id = rows[i].id;
  });
  const keep = state.playing ? state.playing.idx : null;
  renderVerses();
  if (keep !== null) paintPlaying(keep);
}

function setStatusAll(msg) {
  document.querySelectorAll('[data-status]').forEach(n => { n.textContent = msg; });
}

/* ---------- pemutar ---------- */
function cueOf(i) { return document.querySelector(`[data-cue="${i}"]`); }
function statusOf(i) { return document.querySelector(`[data-status="${i}"]`); }

function paintPlaying(i) {
  const el = $('ayah' + i);
  if (el) el.classList.add('is-on');
  const cue = cueOf(i);
  if (cue) cue.innerHTML = icon('i-pause');
  paintRepeat(i);
}

function paintRepeat(i) {
  const st = statusOf(i);
  if (!st || !state.playing) return;
  const { rep, target } = state.playing;
  let dots = '';
  if (target > 1) {
    dots = '<span class="rep-dots">' +
      Array.from({ length: Math.min(target, 10) }, (_, k) => `<i class="${k < rep ? 'on' : ''}"></i>`).join('') +
      '</span>';
  }
  st.innerHTML = `Sedang dibaca · ulangan ${rep}/${target}${dots}`;
}

function clearPaint(i) {
  const el = $('ayah' + i);
  if (el) el.classList.remove('is-on');
  const cue = cueOf(i);
  if (cue) cue.innerHTML = icon('i-play');
  const st = statusOf(i);
  if (st) st.textContent = state.verses[i] && state.verses[i].ar ? '' : 'Ketuk untuk dengar';
}

function stopAll() {
  clearTimeout(state.timer);
  state.timer = null;
  playbackGeneration++;
  if (audio) {
    try { audio.pause(); } catch (error) {}
    try { if (Number.isFinite(audio.duration)) audio.currentTime = 0; } catch (error) {}
  }
  if (state.playing) { clearPaint(state.playing.idx); state.playing = null; }
  updateAllBtn(false);
}

function playAyah(idx, chain) {
  if (state.playing && state.playing.idx === idx && !chain) { stopAll(); return; }
  const wasChain = chain === undefined ? (state.playing ? state.playing.chain : false) : chain;
  clearTimeout(state.timer);
  if (state.playing) clearPaint(state.playing.idx);

  state.playing = { idx, rep: 1, target: state.repeat, chain: !!wasChain, sourceIndex: 0 };
  paintPlaying(idx);
  updateAllBtn(!!wasChain);
  start(idx);
}

function start(idx, sourceIndex = 0) {
  const a = makeAudio();
  const cur = state.playing;
  if (!cur || cur.idx !== idx || !state.surah || !state.verses[idx]) return;
  const sources = audioCandidates(state.surah.id, state.verses[idx].no);
  const safeIndex = Math.min(sourceIndex, sources.length - 1);
  const source = sources[safeIndex];
  cur.sourceIndex = safeIndex;
  activeAudioUrl = source;
  const generation = ++playbackGeneration;
  if (a.src !== source) a.src = source;
  else { try { a.currentTime = 0; } catch (error) {} }
  a.playbackRate = state.speed;
  const promise = a.play();
  if (promise && promise.catch) promise.catch(error => {
    if (generation !== playbackGeneration || !state.playing || state.playing.idx !== idx) return;
    audioDiagnostics('play() ditolak', error);
    if (error && error.name === 'NotAllowedError') {
      clearPaint(idx);
      state.playing = null;
      updateAllBtn(false);
      const status = statusOf(idx);
      if (status) status.textContent = 'Ketuk ayat sekali lagi untuk memulai suara';
    } else if (error && error.name !== 'AbortError') {
      onAudioError(error);
    }
  });
}

function onEnded() {
  const cur = state.playing;
  if (!cur) return;
  const gapMs = state.gap * 1000;

  if (cur.rep < cur.target) {
    cur.rep++;
    paintRepeat(cur.idx);
    state.timer = setTimeout(() => { if (state.playing === cur) start(cur.idx, cur.sourceIndex); }, gapMs);
    return;
  }

  addStar(1);

  if (cur.chain && cur.idx + 1 < state.verses.length) {
    const next = cur.idx + 1;
    clearPaint(cur.idx);
    state.timer = setTimeout(() => { if (state.playing === cur) playAyah(next, true); }, gapMs);
    return;
  }

  const finishedSurah = cur.chain;
  stopAll();
  if (finishedSurah) {
    addStar(5);
    markHafal(state.surah.id);
    toast(`Selesai satu surah! Kamu dapat 5 bintang`);
  }
}

function onAudioError(error) {
  const cur = state.playing;
  if (!cur || !state.surah || !state.verses[cur.idx]) return;
  audioDiagnostics('media gagal', error);
  const idx = cur.idx;
  const sources = audioCandidates(state.surah.id, state.verses[idx].no);
  const next = (cur.sourceIndex || 0) + 1;
  if (next < sources.length) {
    const status = statusOf(idx);
    if (status) status.textContent = navigator.onLine ? 'Mencoba sumber suara cadangan…' : 'Mencoba audio tersimpan cadangan…';
    start(idx, next);
    return;
  }
  stopAll();
  const status = statusOf(idx);
  if (status) status.textContent = navigator.onLine ? 'Suara belum bisa diputar — coba lagi atau pilih qari lain' : 'Audio ayat ini belum tersimpan. Sambungkan internet lalu simpan surah.';
}

function toggleAll() {
  if (state.playing && state.playing.chain) { stopAll(); return; }
  playAyah(0, true);
}

function updateAllBtn(on) {
  const b = $('btnAll');
  b.className = 'btn btn--big ' + (on ? 'btn--stop' : 'btn--go');
  b.querySelector('use').setAttribute('href', on ? '#i-stop' : '#i-play');
  $('btnAllText').textContent = on ? 'Berhenti' : 'Putar semua';
}

function markHafal(id) {
  const set = new Set(store.get('hafal', []));
  set.add(id);
  store.set('hafal', Array.from(set));
}

/* ---------- simpan audio untuk dipakai tanpa internet ---------- */
function isCacheableAudioResponse(response) {
  return !!response && response.status === 200 && response.type !== 'opaque';
}

async function migrateLegacyAudioCaches() {
  if (!('caches' in window)) return;
  await Promise.all(LEGACY_AUDIO_CACHES.map(name => caches.delete(name).catch(() => false)));
}

async function scanSaved() {
  state.saved = new Set();
  if (!('caches' in window)) return;
  try {
    const cache = await caches.open(AUDIO_CACHE);
    const cachedUrls = new Set();
    for (const request of await cache.keys()) {
      const response = await cache.match(request);
      if (isCacheableAudioResponse(response)) cachedUrls.add(request.url);
      else await cache.delete(request);
    }
    SURAHS.forEach(surah => {
      for (let ayah = 1; ayah <= surah.n; ayah++) {
        const available = audioCandidates(surah.id, ayah).some(url => cachedUrls.has(url));
        if (available) state.saved.add(surah.start + ayah - 1);
      }
    });
  } catch (error) { console.warn('Tidak bisa membaca cache audio.', error); }
}

async function fetchCacheableAudio(url) {
  try {
    const response = await fetch(url, { mode: 'cors', cache: 'no-store', redirect: 'follow' });
    return isCacheableAudioResponse(response) ? response : null;
  } catch (error) { return null; }
}

async function saveSurah() {
  const s = state.surah;
  if (!('caches' in window)) { toast('Perangkat ini belum mendukung penyimpanan offline'); return; }
  const btn = $('btnSave');
  btn.disabled = true;
  $('saveMeter').classList.remove('hidden');
  const cache = await caches.open(AUDIO_CACHE);
  let done = 0, failed = 0, fallbackUsed = 0;
  for (const v of state.verses) {
    const candidates = audioCandidates(s.id, v.no);
    let stored = false;
    for (let sourceIndex = 0; sourceIndex < candidates.length; sourceIndex++) {
      const url = candidates[sourceIndex];
      try {
        const existing = await cache.match(url);
        if (isCacheableAudioResponse(existing)) { stored = true; if (sourceIndex > 0) fallbackUsed++; break; }
        if (existing) await cache.delete(url);
        const response = await fetchCacheableAudio(url);
        if (response) { await cache.put(url, response.clone()); stored = true; if (sourceIndex > 0) fallbackUsed++; break; }
      } catch (error) {}
    }
    if (stored) state.saved.add(v.global); else failed++;
    done++;
    $('saveBar').style.width = Math.round(done / state.verses.length * 100) + '%';
  }
  btn.disabled = false;
  setTimeout(() => { $('saveMeter').classList.add('hidden'); $('saveBar').style.width = '0'; }, 700);
  updateSaveBtn();
  if (failed) toast(`${state.verses.length - failed} dari ${state.verses.length} ayat tersimpan`);
  else if (fallbackUsed) toast(`Surah ${s.name} siap offline · ${fallbackUsed} ayat memakai sumber cadangan`);
  else toast(`Surah ${s.name} siap dipakai tanpa internet`);
  storageInfo();
}

function updateSaveBtn() {
  const s = state.surah;
  if (!s) return;
  const ok = surahSaved(s);
  const btn = $('btnSave');
  btn.querySelector('use').setAttribute('href', ok ? '#i-saved' : '#i-download');
  btn.title = ok ? 'Sudah tersimpan di perangkat' : 'Simpan untuk dipakai tanpa internet';
  btn.setAttribute('aria-label', btn.title);
}

async function storageInfo() {
  const el = $('storageInfo');
  if (!el) return;
  let txt = state.saved.size + ' ayat audio tersimpan';
  try {
    if (navigator.storage && navigator.storage.estimate) {
      const { usage } = await navigator.storage.estimate();
      txt += ' · ' + (usage / 1048576).toFixed(1) + ' MB terpakai';
    }
  } catch (e) {}
  el.textContent = txt;
}

/* ---------- panel pengaturan ---------- */
function renderReciters() {
  $('pickReciter').innerHTML = RECITERS.map(r => `
    <button class="pick__opt" type="button" role="radio" data-reciter="${r.id}"
            aria-checked="${r.id === state.reciter}">
      <b>${esc(r.name)}</b><span>${esc(r.note)}</span>
    </button>`).join('');
}

function renderFocusPicker() {
  const el = $('focusPicker');
  if (!el) return;
  el.innerHTML = SURAHS.map(s => `
    <button class="focus-opt" type="button" data-focus="${s.id}" aria-pressed="${state.focus.has(s.id)}">
      <span>${s.id}</span><b>${esc(s.name)}</b>${state.focus.has(s.id) ? icon('i-check') : ''}
    </button>`).join('');
}

function openSheet() {
  renderReciters();
  renderFocusPicker();
  const hideBtn = $('btnHideText');
  if (hideBtn) hideBtn.setAttribute('aria-checked', String(state.hideText));
  renderSegs();
  storageInfo();
  $('sheet').classList.remove('hidden');
  $('btnCloseSheet').focus();
}
function closeSheet() {
  $('sheet').classList.add('hidden');
  $('btnSheet').focus();
}

/* ---------- kejadian ---------- */
document.addEventListener('click', async e => {
  const t = e.target.closest('button');
  if (!t) return;

  if (t.dataset.level) {
    state.level = t.dataset.level; store.set('level', state.level);
    renderLevels(); renderGrid(); return;
  }
  if (t.dataset.id) {
    const s = SURAHS.find(x => x.id === +t.dataset.id);
    if (s) openSurah(s);
    return;
  }
  if (t.dataset.idx !== undefined) { playAyah(+t.dataset.idx, false); return; }
  if (t.dataset.repeat) {
    state.repeat = +t.dataset.repeat; store.set('repeat', state.repeat);
    if (state.playing) { state.playing.target = state.repeat; paintRepeat(state.playing.idx); }
    renderSegs(); return;
  }
  if (t.dataset.gap !== undefined && t.dataset.gap !== '') {
    state.gap = +t.dataset.gap; store.set('gap', state.gap); renderSegs(); return;
  }
  if (t.dataset.speed) {
    state.speed = +t.dataset.speed; store.set('speed', state.speed);
    if (audio) audio.playbackRate = state.speed;
    renderSegs(); return;
  }
  if (t.dataset.mark) {
    if (!FEATURES.memorizationMarker) return;
    const ayahNo = +t.dataset.mark;
    const current = state.surah ? getMarker(state.surah.id) : 0;
    if (!state.surah) return;
    if (current === ayahNo) {
      clearMarker(state.surah.id);
      toast('Penanda hafalan dihapus');
    } else {
      setMarker(state.surah.id, ayahNo);
      toast(`Penanda hafalan: ayat ${ayahNo}`);
    }
    renderVerses();
    renderMarkerSummary();
    renderGrid();
    return;
  }

  if (t.id === 'btnClearMarker') {
    if (state.surah) {
      clearMarker(state.surah.id);
      renderVerses();
      renderMarkerSummary();
      renderGrid();
      toast('Penanda hafalan dihapus');
    }
    return;
  }

  if (t.dataset.focus) {
    const id = +t.dataset.focus;
    if (state.focus.has(id)) state.focus.delete(id); else state.focus.add(id);
    store.set('focus', Array.from(state.focus));
    renderFocusPicker();
    renderLevels();
    if (state.level === 'focus') renderGrid();
    return;
  }

  if (t.dataset.reciter) {
    if (t.dataset.reciter !== state.reciter) {
      stopAll();
      state.reciter = t.dataset.reciter; store.set('reciter', state.reciter);
      await scanSaved(); renderReciters(); updateSaveBtn(); storageInfo();
      if (!state.surah) renderGrid();
      toast('Suara qari diganti');
    }
    return;
  }

  switch (t.id) {
    case 'btnHideText':
      state.hideText = !state.hideText; store.set('hideText', state.hideText);
      t.setAttribute('aria-checked', String(state.hideText));
      if (state.surah) renderVerses();
      toast(state.hideText ? 'Mode fokus aktif: hanya nomor ayat' : 'Teks ayat ditampilkan');
      break;
    case 'btnTune': {
      const open = t.getAttribute('aria-expanded') === 'true';
      t.setAttribute('aria-expanded', String(!open));
      $('tune').classList.toggle('hidden', open);
      break;
    }
    case 'btnBack': backHome(); break;
    case 'btnAll': toggleAll(); break;
    case 'btnSave': saveSurah(); break;
    case 'btnSheet': openSheet(); break;
    case 'btnCloseSheet': closeSheet(); break;
    case 'btnClearAudio':
      if ('caches' in window) await caches.delete(AUDIO_CACHE);
      await scanSaved(); updateSaveBtn(); storageInfo(); renderGrid();
      toast('Audio tersimpan sudah dihapus');
      break;
    case 'btnResetStars':
      state.stars = 0; store.set('stars', 0); store.del('hafal');
      renderSky(); renderGrid(); toast('Bintang dimulai dari nol');
      break;
  }
});

$('sheet').addEventListener('click', e => { if (e.target.id === 'sheet') closeSheet(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (!$('installSheet').classList.contains('hidden')) closeInstallSheet();
    else if (!$('sheet').classList.contains('hidden')) closeSheet();
    else if (state.playing) stopAll();
  }
});
window.addEventListener('offline', () => toast('Tanpa internet — surah yang sudah disimpan tetap bisa diputar'));
function suspendAudioSession() {
  if (state.playing) stopAll();
  disposeAudio();
}
window.addEventListener('pagehide', suspendAudioSession);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') suspendAudioSession();
});


/* ---------- pasang di layar utama ---------- */
let installTrigger = null;

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.startsWith('android-app://');
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isIOSSafari() {
  return isIOS() && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(navigator.userAgent);
}

function hideInstallOffer() {
  $('installBanner').classList.add('hidden');
}

function showInstallOffer() {
  $('installBanner').classList.remove('hidden');
}

function refreshInstallOffer() {
  if (isStandalone()) {
    hideInstallOffer();
    return;
  }
  showInstallOffer();
}

function closeInstallSheet() {
  $('installSheet').classList.add('hidden');
  if (installTrigger) installTrigger.focus();
}

function openInstallSheet(trigger) {
  installTrigger = trigger;
  $('installIOSSteps').classList.toggle('hidden', !isIOSSafari());
  $('installIOSBrowser').classList.toggle('hidden', isIOSSafari());
  $('installSheet').classList.remove('hidden');
  $('btnCloseInstallSheet').focus();
}

async function requestInstall(trigger) {
  if (isStandalone()) { hideInstallOffer(); return; }

  if (window.__deferredInstall) {
    const promptEvent = window.__deferredInstall;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice.catch(() => null);
    window.__deferredInstall = null;
    if (choice && choice.outcome === 'accepted') {
      hideInstallOffer();
      return;
    }
    refreshInstallOffer();
    return;
  }

  if (isIOS()) openInstallSheet(trigger);
}

window.addEventListener('installready', refreshInstallOffer);
window.addEventListener('appinstalled', () => {
  window.__deferredInstall = null;
  hideInstallOffer();
});

const installButton = $('btnInstall');
installButton.textContent = 'Install Aplikasi';
installButton.addEventListener('click', event => requestInstall(event.currentTarget));

const dismissInstallButton = $('btnDismissInstall');
if (dismissInstallButton) {
  dismissInstallButton.classList.add('hidden');
  dismissInstallButton.setAttribute('aria-hidden', 'true');
  dismissInstallButton.tabIndex = -1;
}

const standaloneQuery = window.matchMedia('(display-mode: standalone)');
if (standaloneQuery.addEventListener) standaloneQuery.addEventListener('change', refreshInstallOffer);

$('btnCloseInstallSheet').addEventListener('click', closeInstallSheet);
$('installSheet').addEventListener('click', event => {
  if (event.target.id === 'installSheet') closeInstallSheet();
});

/* ---------- mulai ---------- */
(async function init() {
  renderSky();
  renderLevels();
  await migrateLegacyAudioCaches();
  await scanSaved();
  renderGrid();
  refreshInstallOffer();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' })
      .then(registration => registration.update())
      .catch(() => {});
  }
})();