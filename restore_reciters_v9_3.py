from pathlib import Path
import re, sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else '_site')
BUILD = '9.3'
app = root / 'app.js'
js = app.read_text()

# Restore all original qari choices, while using stable EveryAyah per-reciter files.
old = '''function stableAudioUrl(surahId, ayahNo) {
  return `https://everyayah.com/data/Alafasy_128kbps/${String(surahId).padStart(3, '0')}${String(ayahNo).padStart(3, '0')}.mp3`;
}'''
new = '''const RECITER_FOLDERS = {
  'ar.husary': 'Husary_128kbps',
  'ar.alafasy': 'Alafasy_128kbps',
  'ar.minshawi': 'Minshawy_Murattal_128kbps',
  'ar.abdulbasitmurattal': 'Abdul_Basit_Murattal_192kbps'
};
function reciterFolder(reciter) {
  return RECITER_FOLDERS[reciter] || RECITER_FOLDERS['ar.alafasy'];
}
function stableAudioUrl(surahId, ayahNo, reciter = state.reciter) {
  const folder = reciterFolder(reciter);
  return `https://everyayah.com/data/${folder}/${String(surahId).padStart(3, '0')}${String(ayahNo).padStart(3, '0')}.mp3`;
}'''
if old not in js:
    raise SystemExit('stableAudioUrl block not found')
js = js.replace(old, new, 1)

# Track whether the current attempt is already using the fallback source.
js = js.replace('let unlocked = false;', 'let unlocked = false;\nlet audioFallbackActive = false;', 1)

old = '''function start(idx) {
  const a = makeAudio();
  unlocked = true;
  a.src = stableAudioUrl(state.surah.id, state.verses[idx].no);
  a.playbackRate = state.speed;
  const p = a.play();
  if (p && p.catch) p.catch(err => {
    if (err && err.name === 'NotAllowedError') {
      const st = statusOf(idx);
      if (st) st.textContent = 'Ketuk sekali lagi untuk memulai suara';
    } else {
      onAudioError();
    }
  });
}'''
new = '''function start(idx, fallback = false) {
  const a = makeAudio();
  unlocked = true;
  audioFallbackActive = fallback;
  const selectedReciter = fallback ? 'ar.alafasy' : state.reciter;
  a.src = stableAudioUrl(state.surah.id, state.verses[idx].no, selectedReciter);
  a.playbackRate = state.speed;
  const p = a.play();
  if (p && p.catch) p.catch(err => {
    if (err && err.name === 'NotAllowedError') {
      const st = statusOf(idx);
      if (st) st.textContent = 'Ketuk sekali lagi untuk memulai suara';
    } else {
      onAudioError();
    }
  });
}'''
if old not in js:
    raise SystemExit('start block not found')
js = js.replace(old, new, 1)

old = '''function onAudioError() {
  const cur = state.playing;
  const idx = cur ? cur.idx : null;
  stopAll();
  if (idx !== null) {
    const st = statusOf(idx);
    if (st) st.textContent = navigator.onLine
      ? 'Suara gagal dimuat — coba qari lain di Pengaturan'
      : 'Suara ini belum tersimpan. Sambungkan internet dulu, lalu tekan tombol simpan.';
  }
}'''
new = '''function onAudioError() {
  const cur = state.playing;
  const idx = cur ? cur.idx : null;

  // Keep the selected qari, but transparently fall back to Al-Afasy for this
  // playback attempt if the selected source is temporarily unavailable.
  if (cur && idx !== null && state.reciter !== 'ar.alafasy' && !audioFallbackActive && navigator.onLine) {
    const st = statusOf(idx);
    if (st) st.textContent = 'Sumber qari ini sedang bermasalah — mencoba Al-Afasy…';
    start(idx, true);
    return;
  }

  stopAll();
  audioFallbackActive = false;
  if (idx !== null) {
    const st = statusOf(idx);
    if (st) st.textContent = navigator.onLine
      ? 'Suara gagal dimuat — coba lagi atau pilih qari lain'
      : 'Suara ini belum tersimpan. Sambungkan internet dulu, lalu tekan tombol simpan.';
  }
}'''
if old not in js:
    raise SystemExit('onAudioError block not found')
js = js.replace(old, new, 1)

# Restore interactive qari choices in Settings.
old = '''function renderReciters() {
  $('pickReciter').innerHTML = `<div class="pick__opt pick__opt--static"><b>Syekh Mishary Al-Afasy</b><span>sumber audio stabil untuk perangkat mobile</span></div>`;
}'''
new = '''function renderReciters() {
  $('pickReciter').innerHTML = RECITERS.map(r => `
    <button class="pick__opt" type="button" role="radio" data-reciter="${r.id}"
            aria-checked="${r.id === state.reciter}">
      <b>${esc(r.name)}</b><span>${esc(r.note)}</span>
    </button>`).join('');
}'''
if old not in js:
    raise SystemExit('renderReciters static block not found')
js = js.replace(old, new, 1)

# Saved/offline status should be specific to the selected qari.
old = '''    keys.forEach(req => {
      const m = req.url.match(/\/(\d{3})(\d{3})\.mp3$/);
      if (!m) return;
      const surah = SURAHS.find(s => s.id === +m[1]);'''
new = '''    const selectedFolder = `/data/${reciterFolder(state.reciter)}/`;
    keys.forEach(req => {
      if (!req.url.includes(selectedFolder)) return;
      const m = req.url.match(/\/(\d{3})(\d{3})\.mp3$/);
      if (!m) return;
      const surah = SURAHS.find(s => s.id === +m[1]);'''
if old not in js:
    raise SystemExit('scanSaved keys block not found')
js = js.replace(old, new, 1)

# Reset fallback state when stopping/changing playback.
js = js.replace('  updateAllBtn(false);\n}', '  audioFallbackActive = false;\n  updateAllBtn(false);\n}', 1)

# Cache-bust service worker registration to v9.3.
js = re.sub(
    r"navigator\.serviceWorker\.register\('sw\.js\?v=[^']+'\s*,\s*\{ updateViaCache: 'none' \}\)",
    f"navigator.serviceWorker.register('sw.js?v={BUILD}', {{ updateViaCache: 'none' }})",
    js,
    count=1
)
app.write_text(js)

# Version shell assets.
index = root / 'index.html'
h = index.read_text()
h = re.sub(r'href="app\.css\?v=[^"]+"', f'href="app.css?v={BUILD}"', h)
h = re.sub(r'href="manifest\.webmanifest\?v=[^"]+"', f'href="manifest.webmanifest?v={BUILD}"', h)
h = re.sub(r'src="data\.js\?v=[^"]+"', f'src="data.js?v={BUILD}"', h)
h = re.sub(r'src="app\.js\?v=[^"]+"', f'src="app.js?v={BUILD}"', h)
h = re.sub(r'<meta name="hafizku-build" content="[^"]+">', f'<meta name="hafizku-build" content="v{BUILD}">', h)
index.write_text(h)

# Make qari options visually obvious and tappable for parents.
css = root / 'app.css'
c = css.read_text()
c += r'''

/* Hafizku v9.3 — restored qari selector */
#pickReciter {
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:9px;
  margin-top:10px;
}
#pickReciter .pick__opt {
  min-height:72px;
  padding:11px 12px;
  border:2px solid #BAE6FD;
  border-radius:17px;
  background:#fff;
  color:#334155;
  text-align:left;
  box-shadow:0 4px 0 rgba(56,189,248,.14);
}
#pickReciter .pick__opt b,
#pickReciter .pick__opt span { display:block; }
#pickReciter .pick__opt b { color:#075985; font-size:.92rem; }
#pickReciter .pick__opt span { margin-top:3px; color:#718096; font-size:.73rem; line-height:1.3; }
#pickReciter .pick__opt[aria-checked="true"] {
  background:#FEF3C7;
  border-color:#FBBF24;
  box-shadow:0 4px 0 rgba(217,119,6,.18);
}
#pickReciter .pick__opt[aria-checked="true"] b { color:#92400E; }
@media (max-width:420px) {
  #pickReciter { grid-template-columns:1fr; }
  #pickReciter .pick__opt { min-height:62px; }
}
'''
css.write_text(c)

sw = root / 'sw.js'
s = sw.read_text()
s = re.sub(r"const VERSION = '[^']+';", "const VERSION = 'v9.3';", s, count=1)
s = re.sub(r"'\./app\.css\?v=[^']+'", f"'./app.css?v={BUILD}'", s)
s = re.sub(r"'\./app\.js\?v=[^']+'", f"'./app.js?v={BUILD}'", s)
s = re.sub(r"'\./data\.js\?v=[^']+'", f"'./data.js?v={BUILD}'", s)
s = re.sub(r"'\./manifest\.webmanifest\?v=[^']+'", f"'./manifest.webmanifest?v={BUILD}'", s)
sw.write_text(s)

print('Hafizku v9.3 qari choices restored')
