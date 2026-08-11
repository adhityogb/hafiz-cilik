from pathlib import Path
import json, sys
root = Path(sys.argv[1] if len(sys.argv) > 1 else '_site')

def replace_once(text, old, new, label):
    if old not in text:
        raise SystemExit(f'Missing expected block: {label}')
    return text.replace(old, new, 1)

p = root / 'index.html'
s = p.read_text()
s = s.replace('<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">', '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">')
s = s.replace('<title>Hafiz Cilik — Belajar Hafal Juz 30</title>', '<title>Hafizku — Teman Hafalan Juz 30</title>')
s = s.replace('content="Aplikasi mendengar dan menghafal Juz 30 untuk anak. Bisa dipakai tanpa internet."', 'content="Hafizku membantu anak mendengar, mengulang, dan menghafal Juz 30 dengan fokus."')
s = s.replace('<meta name="apple-mobile-web-app-title" content="Hafiz Cilik">', '<meta name="apple-mobile-web-app-title" content="Hafizku">')
s = s.replace('<h1 class="brand__name">Hafiz Cilik</h1>', '<h1 class="brand__name">Hafizku</h1>')
s = s.replace('<p class="brand__sub">Juz 30 · dengar &amp; hafal</p>', '<p class="brand__sub">Juz 30 · dengar, ulang, hafal</p>')
s = s.replace('<div class="row__top"><span class="row__label">Suara qari</span></div>', '<div class="row__top"><span class="row__label">Suara bacaan</span></div>')
needle = '''    <div class="row" style="margin-top:10px">\n      <div class="row__top"><span class="row__label">Tersimpan di perangkat</span></div>'''
insert = '''    <div class="row" style="margin-top:10px">\n      <div class="row__top">\n        <span class="row__label">Mode fokus hafalan</span>\n        <button class="switch" id="btnHideText" type="button" role="switch" aria-checked="false"><span></span></button>\n      </div>\n      <span class="row__hint">Sembunyikan teks Arab, latin, dan arti. Daftar ayat menjadi tombol angka saja.</span>\n    </div>\n\n    <div class="row" style="margin-top:10px">\n      <div class="row__top"><span class="row__label">Target Hafalan</span></div>\n      <span class="row__hint">Pilih surah yang sedang dihafal dari level mana pun.</span>\n      <div class="focus-pick" id="focusPicker"></div>\n    </div>\n\n''' + needle
s = replace_once(s, needle, insert, 'settings insertion')
p.write_text(s)

p = root / 'manifest.webmanifest'
m = json.loads(p.read_text())
m['name'] = 'Hafizku — Teman Hafalan Juz 30'
m['short_name'] = 'Hafizku'
m['description'] = 'Dengar, ulang, dan hafalkan Juz 30 dengan fokus.'
m['icons'] = [
    {'src':'icons/favicon.svg','sizes':'any','type':'image/svg+xml','purpose':'any maskable'},
    {'src':'icons/icon-192.png','sizes':'192x192','type':'image/png'},
    {'src':'icons/icon-512.png','sizes':'512x512','type':'image/png'}
]
p.write_text(json.dumps(m, ensure_ascii=False, indent=2))

(root / 'icons' / 'favicon.svg').write_text('''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6f5bd3"/><stop offset="1" stop-color="#2f255f"/></linearGradient></defs><rect width="512" height="512" rx="112" fill="url(#g)"/><circle cx="184" cy="148" r="72" fill="#ffd86b"/><circle cx="211" cy="126" r="70" fill="#5b46ae"/><path d="M378 86l10 25 26 3-20 17 6 26-22-14-22 14 6-26-20-17 26-3z" fill="#fff"/><path d="M88 258c64-38 121-34 168 8v134c-52-39-107-44-168-14z" fill="#fff" stroke="#e9e5ff" stroke-width="12" stroke-linejoin="round"/><path d="M424 258c-64-38-121-34-168 8v134c52-39 107-44 168-14z" fill="#fff" stroke="#e9e5ff" stroke-width="12" stroke-linejoin="round"/><path d="M256 268v132" stroke="#493a92" stroke-width="12" stroke-linecap="round"/><path d="M126 301c37-16 72-13 99 6M126 334c37-16 72-13 99 6M386 301c-37-16-72-13-99 6M386 334c-37-16-72-13-99 6" stroke="#7e70c5" stroke-width="10" stroke-linecap="round"/></svg>''')

p = root / 'app.js'
s = p.read_text()
s = s.replace("  level: store.get('level', '1'),", "  level: store.get('level', '1'),\n  hideText: store.get('hideText', false),\n  focus: new Set(store.get('focus', [])),", 1)
s = s.replace("let unlocked = false;", "let unlocked = false;\n\nfunction stableAudioUrl(surahId, ayahNo) {\n  return `https://everyayah.com/data/Alafasy_128kbps/${String(surahId).padStart(3, '0')}${String(ayahNo).padStart(3, '0')}.mp3`;\n}", 1)
s = s.replace("  audio.crossOrigin = 'anonymous';\n", "", 1)
old = '''function renderLevels() {\n  $('levels').innerHTML = LEVELS.map(l => `\n    <button class="chip" type="button" data-level="${l.key}" aria-pressed="${l.key === state.level}">\n      ${esc(l.label)} <small>${esc(l.hint)}</small>\n    </button>`).join('');\n}\n'''
new = '''function renderLevels() {\n  const focusChip = `<button class="chip chip--focus" type="button" data-level="focus" aria-pressed="${state.level === 'focus'}">Target Hafalan <small>${state.focus.size || 0} surah</small></button>`;\n  $('levels').innerHTML = focusChip + LEVELS.map(l => `\n    <button class="chip" type="button" data-level="${l.key}" aria-pressed="${l.key === state.level}">\n      ${esc(l.label)} <small>${esc(l.hint)}</small>\n    </button>`).join('');\n}\n'''
s = replace_once(s, old, new, 'renderLevels')
s = s.replace("  const level = LEVELS.find(l => l.key === state.level) || LEVELS[0];\n  const list = SURAHS.filter(level.test);", "  const level = LEVELS.find(l => l.key === state.level) || LEVELS[0];\n  const list = state.level === 'focus' ? SURAHS.filter(s => state.focus.has(s.id)) : SURAHS.filter(level.test);", 1)
s = s.replace("  $('grid').innerHTML = list.map(s => `", "  if (!list.length && state.level === 'focus') {\n    $('grid').innerHTML = `<div class=\"empty-focus\"><b>Belum ada target hafalan</b><span>Pilih surah di Pengaturan → Target Hafalan.</span></div>`;\n    return;\n  }\n\n  $('grid').innerHTML = list.map(s => `", 1)
start = s.index('function renderVerses() {')
end = s.index('\n}\n\n/* ---------- teks ayat ---------- */', start) + 2
newfun = '''function renderVerses() {\n  const hasText = state.verses.some(v => v.ar);\n  const wrap = $('ayat');\n\n  if (state.hideText) {\n    wrap.className = 'ayat ayat--numbers';\n    wrap.innerHTML = state.verses.map((v, i) => `\n      <button class="ayah-number" type="button" data-idx="${i}" id="ayah${i}" aria-label="Putar ayat ${v.no}">\n        <span class="ayah__no">${v.no}</span>\n        <span class="sr-only" data-status="${i}">Ayat ${v.no}</span>\n      </button>`).join('');\n    return;\n  }\n\n  wrap.className = 'ayat' + (hasText ? ' ayat--full' : '');\n  wrap.innerHTML = state.verses.map((v, i) => `\n    <button class="ayah" type="button" data-idx="${i}" id="ayah${i}">\n      <span class="ayah__no" aria-hidden="true">${v.no}</span>\n      <span class="ayah__body">\n        <span class="sr-only">Ayat ${v.no}. </span>\n        ${v.ar ? `<span class="ayah__ar" dir="rtl" lang="ar">${esc(v.ar)}</span>` : ''}\n        ${v.latin ? `<span class="ayah__latin">${esc(v.latin)}</span>` : ''}\n        ${v.id ? `<span class="ayah__id">${esc(v.id)}</span>` : ''}\n        <span class="ayah__status" data-status="${i}">${v.ar ? '' : 'Ketuk untuk dengar'}</span>\n      </span>\n      ${icon('i-play', 'ayah__cue')}\n    </button>`).join('');\n  wrap.querySelectorAll('.ayah').forEach((el, i) => {\n    const cue = el.querySelector('.ayah__cue');\n    const box = document.createElement('span');\n    box.className = 'ayah__cue';\n    box.dataset.cue = i;\n    box.innerHTML = icon('i-play');\n    cue.replaceWith(box);\n  });\n}\n'''
s = s[:start] + newfun + s[end:]
s = s.replace("  a.src = audioUrl(state.reciter, state.verses[idx].global);", "  a.src = stableAudioUrl(state.surah.id, state.verses[idx].no);", 1)
s = s.replace("  const url = audioUrl(state.reciter, v.global);", "  const url = stableAudioUrl(state.surah.id, v.no);", 1)
s = s.replace("    const url = audioUrl(state.reciter, v.global);", "    const url = stableAudioUrl(state.surah.id, v.no);", 1)
ss = s.index('async function scanSaved() {')
ee = s.index('\n}\n\nasync function saveSurah()', ss) + 2
scan = '''async function scanSaved() {\n  state.saved = new Set();\n  if (!('caches' in window)) return;\n  try {\n    const cache = await caches.open(AUDIO_CACHE);\n    const keys = await cache.keys();\n    keys.forEach(req => {\n      const m = req.url.match(/\\/(\\d{3})(\\d{3})\\.mp3$/);\n      if (!m) return;\n      const surah = SURAHS.find(s => s.id === +m[1]);\n      const ayah = +m[2];\n      if (surah && ayah >= 1 && ayah <= surah.n) state.saved.add(surah.start + ayah - 1);\n    });\n  } catch (e) {}\n}\n'''
s = s[:ss] + scan + s[ee:]
old = '''function renderReciters() {\n  $('pickReciter').innerHTML = RECITERS.map(r => `\n    <button class="pick__opt" type="button" role="radio" data-reciter="${r.id}"\n            aria-checked="${r.id === state.reciter}">\n      <b>${esc(r.name)}</b><span>${esc(r.note)}</span>\n    </button>`).join('');\n}\n'''
new = '''function renderReciters() {\n  $('pickReciter').innerHTML = `<div class="pick__opt pick__opt--static"><b>Syekh Mishary Al-Afasy</b><span>sumber audio stabil untuk perangkat mobile</span></div>`;\n}\n\nfunction renderFocusPicker() {\n  const el = $('focusPicker');\n  if (!el) return;\n  el.innerHTML = SURAHS.map(s => `\n    <button class="focus-opt" type="button" data-focus="${s.id}" aria-pressed="${state.focus.has(s.id)}">\n      <span>${s.id}</span><b>${esc(s.name)}</b>${state.focus.has(s.id) ? icon('i-check') : ''}\n    </button>`).join('');\n}\n'''
s = replace_once(s, old, new, 'renderReciters')
s = s.replace("  renderReciters();\n  renderSegs();", "  renderReciters();\n  renderFocusPicker();\n  const hideBtn = $('btnHideText');\n  if (hideBtn) hideBtn.setAttribute('aria-checked', String(state.hideText));\n  renderSegs();", 1)
needle = "  if (t.dataset.reciter) {\n"
s = replace_once(s, needle, '''  if (t.dataset.focus) {\n    const id = +t.dataset.focus;\n    if (state.focus.has(id)) state.focus.delete(id); else state.focus.add(id);\n    store.set('focus', Array.from(state.focus));\n    renderFocusPicker();\n    renderLevels();\n    if (state.level === 'focus') renderGrid();\n    return;\n  }\n\n  if (t.dataset.reciter) {\n''', 'focus click')
s = s.replace("    case 'btnTune': {", "    case 'btnHideText':\n      state.hideText = !state.hideText; store.set('hideText', state.hideText);\n      t.setAttribute('aria-checked', String(state.hideText));\n      if (state.surah) renderVerses();\n      toast(state.hideText ? 'Mode fokus aktif: hanya nomor ayat' : 'Teks ayat ditampilkan');\n      break;\n    case 'btnTune': {", 1)
s = s.replace("window.addEventListener('offline', () => toast('Tanpa internet — surah yang sudah disimpan tetap bisa diputar'));", "window.addEventListener('offline', () => toast('Tanpa internet — surah yang sudah disimpan tetap bisa diputar'));\n\n['gesturestart', 'gesturechange', 'gestureend'].forEach(ev => document.addEventListener(ev, e => e.preventDefault(), { passive: false }));\ndocument.addEventListener('touchmove', e => { if (e.touches && e.touches.length > 1) e.preventDefault(); }, { passive: false });", 1)
p.write_text(s)

p = root / 'app.css'
css = p.read_text() + '''\n\n/* Hafizku v6 */\nhtml { touch-action: manipulation; -webkit-text-size-adjust: 100%; }\nbody { overscroll-behavior-x: none; }\n.chip--focus { border-color: #7b68c8; background: #f0edff; }\n.empty-focus { grid-column: 1 / -1; padding: 28px 18px; border: 2px dashed #b9c9da; border-radius: 24px; text-align: center; background: rgba(255,255,255,.72); }\n.empty-focus b, .empty-focus span { display:block; }\n.empty-focus span { margin-top:6px; opacity:.7; }\n.switch { width:52px; height:30px; border:0; padding:3px; border-radius:999px; background:#d7dfea; box-shadow:inset 0 0 0 1px rgba(0,0,0,.06); }\n.switch span { display:block; width:24px; height:24px; border-radius:50%; background:#fff; box-shadow:0 2px 5px rgba(0,0,0,.18); transition:transform .18s ease; }\n.switch[aria-checked="true"] { background:#6f5bd3; }\n.switch[aria-checked="true"] span { transform:translateX(22px); }\n.focus-pick { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:7px; margin-top:10px; max-height:260px; overflow:auto; }\n.focus-opt { min-width:0; display:grid; grid-template-columns:34px 1fr 20px; align-items:center; gap:7px; border:1px solid #d8e2ec; border-radius:14px; background:#fff; padding:8px; text-align:left; color:inherit; }\n.focus-opt[aria-pressed="true"] { border-color:#806bd0; background:#f0edff; }\n.focus-opt > span { width:30px; height:30px; display:grid; place-items:center; border-radius:10px; background:#e9f4ff; font-weight:800; }\n.focus-opt b { overflow:hidden; white-space:nowrap; text-overflow:ellipsis; font-size:13px; }\n.focus-opt .ico { width:17px; height:17px; color:#5c49b5; }\n.pick__opt--static { cursor:default; }\n.ayat--numbers { grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; }\n.ayah-number { aspect-ratio:1; min-height:68px; border:2px solid #cfe3f5; background:#fff; border-radius:22px; display:grid; place-items:center; box-shadow:0 5px 0 #d5e3ee; color:#17395b; }\n.ayah-number .ayah__no { position:static; width:46px; height:46px; display:grid; place-items:center; border-radius:15px; background:#cdeaff; border:2px solid #70bce9; font-size:21px; font-weight:800; }\n.ayah-number.is-on { border-color:#42a36f; background:#edf9f1; transform:translateY(2px); box-shadow:0 3px 0 #bad9c5; }\n@media (max-width:380px) { .ayat--numbers { grid-template-columns:repeat(3,minmax(0,1fr)); } }\n'''
p.write_text(css)

p = root / 'sw.js'
sw = p.read_text().replace("const VERSION = 'v1';", "const VERSION = 'v6';")
p.write_text(sw)
print('customization complete')
