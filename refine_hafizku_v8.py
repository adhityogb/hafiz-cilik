from pathlib import Path
import json, re, sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else '_site')

def replace_once(text, old, new, label):
    if old not in text:
        raise SystemExit(f'Missing expected block: {label}')
    return text.replace(old, new, 1)

# ---------- index.html ----------
idx = root / 'index.html'
s = idx.read_text()
if 'id="i-bookmark"' not in s:
    s = s.replace(
        '<symbol id="i-mosque" viewBox="0 0 24 24"><path d="M12 2.5c1.8 1.8 3 3.2 3 4.8 0 1.4-1.3 2.2-3 2.2S9 8.7 9 7.3c0-1.6 1.2-3 3-4.8z"/><path d="M4 20.5v-7a8 8 0 0 1 16 0v7z"/><path d="M10 20.5v-4a2 2 0 0 1 4 0v4"/></symbol>',
        '<symbol id="i-mosque" viewBox="0 0 24 24"><path d="M12 2.5c1.8 1.8 3 3.2 3 4.8 0 1.4-1.3 2.2-3 2.2S9 8.7 9 7.3c0-1.6 1.2-3 3-4.8z"/><path d="M4 20.5v-7a8 8 0 0 1 16 0v7z"/><path d="M10 20.5v-4a2 2 0 0 1 4 0v4"/></symbol>\n    <symbol id="i-bookmark" viewBox="0 0 24 24"><path d="M7 4.5h10a1.5 1.5 0 0 1 1.5 1.5v13.4L12 15.7l-6.5 3.7V6A1.5 1.5 0 0 1 7 4.5z"/></symbol>\n    <symbol id="i-book-open" viewBox="0 0 24 24"><path d="M12 7.2c-1.9-1.4-4.6-2-8-1.7v12.2c3.5-.3 6.2.3 8 1.7 1.8-1.4 4.5-2 8-1.7V5.5c-3.4-.3-6.1.3-8 1.7z"/><path d="M12 7.2v12.2"/></symbol>'
    )
s = s.replace('<link rel="apple-touch-icon" href="icons/icon-192.png">', '<link rel="apple-touch-icon" sizes="180x180" href="icons/apple-touch-icon.png">')
s = s.replace('<div class="brand__mark" aria-hidden="true"><svg class="ico"><use href="#i-mosque"></use></svg></div>', '<div class="brand__mark" aria-hidden="true"><svg class="ico"><use href="#i-book-open"></use></svg></div>')
needle = '    </section>\n\n    <div class="rows">'
insert = '    </section>\n\n    <section class="marker-panel" id="markerPanel" aria-label="Penanda hafalan">\n      <div class="marker-panel__text">\n        <b>Penanda hafalan</b>\n        <span id="markerText">Belum ada penanda untuk surah ini.</span>\n      </div>\n      <button class="btn btn--soft hidden" id="btnClearMarker" type="button">\n        <svg class="ico" aria-hidden="true"><use href="#i-trash"></use></svg> Hapus\n      </button>\n    </section>\n\n    <div class="rows">'
s = replace_once(s, needle, insert, 'marker panel insertion')
idx.write_text(s)

# ---------- manifest ----------
man = root / 'manifest.webmanifest'
m = json.loads(man.read_text())
m['icons'] = [
    {'src':'icons/icon-192.png','sizes':'192x192','type':'image/png','purpose':'any maskable'},
    {'src':'icons/icon-512.png','sizes':'512x512','type':'image/png','purpose':'any maskable'},
    {'src':'icons/icon-maskable-512.png','sizes':'512x512','type':'image/png','purpose':'maskable'}
]
man.write_text(json.dumps(m, ensure_ascii=False, indent=2))

# ---------- app.js ----------
app = root / 'app.js'
js = app.read_text()
js = replace_once(js, "  focus: new Set(store.get('focus', [])),", "  focus: new Set(store.get('focus', [])),\n  markers: store.get('markers', {}),", 'state markers')

marker_helpers = '''
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
  const text = $('markerText');
  const btn = $('btnClearMarker');
  if (!text || !btn || !state.surah) return;
  const ayah = getMarker(state.surah.id);
  if (ayah) {
    text.textContent = `Hafalan saat ini: ayat ${ayah}`;
    btn.classList.remove('hidden');
  } else {
    text.textContent = 'Belum ada penanda untuk surah ini.';
    btn.classList.add('hidden');
  }
}
'''
js = replace_once(js, 'function surahSaved(s) {', marker_helpers + '\nfunction surahSaved(s) {', 'insert marker helpers')

old_grid_fragment = "          ${surahSaved(s) ? `<span class=\"card__badge\">${icon('i-saved')}<span class=\"sr-only\">Tersimpan, bisa tanpa internet</span></span>` : ''}\n        </span>"
new_grid_fragment = "          ${getMarker(s.id) ? `<span class=\"card__badge card__badge--marker\">${icon('i-bookmark')}<span>Ayat ${getMarker(s.id)}</span></span>` : ''}\n          ${surahSaved(s) ? `<span class=\"card__badge\">${icon('i-saved')}<span class=\"sr-only\">Tersimpan, bisa tanpa internet</span></span>` : ''}\n        </span>"
js = replace_once(js, old_grid_fragment, new_grid_fragment, 'grid marker badge')

js = replace_once(js, '  renderSegs();\n  renderVerses();\n  updateSaveBtn();', '  renderSegs();\n  renderVerses();\n  renderMarkerSummary();\n  updateSaveBtn();', 'openSurah marker summary')

mrv = re.search(r'function renderVerses\(\) \{.*?\n\}\n+?/\* ---------- teks ayat ---------- \*/', js, re.S)
if not mrv:
    raise SystemExit('renderVerses block not found')
start, end = mrv.span()
newfun = '''function renderVerses() {
  const hasText = state.verses.some(v => v.ar);
  const wrap = $('ayat');
  const marker = state.surah ? getMarker(state.surah.id) : 0;

  if (state.hideText) {
    wrap.className = 'ayat ayat--numbers';
    wrap.innerHTML = state.verses.map((v, i) => `
      <div class="ayah-card ${marker === v.no ? 'is-marked' : ''}">
        <button class="ayah-number" type="button" data-idx="${i}" id="ayah${i}" aria-label="Putar ayat ${v.no}">
          <span class="ayah__no">${v.no}</span>
          <span class="ayah-number__label">Ayat ${v.no}</span>
          <span class="sr-only" data-status="${i}">Ayat ${v.no}</span>
        </button>
        <button class="ayah-mark-btn ${marker === v.no ? 'is-on' : ''}" type="button" data-mark="${v.no}" aria-pressed="${marker === v.no}" aria-label="Tandai ayat ${v.no} sebagai hafalan saat ini">
          ${icon('i-bookmark')}
        </button>
      </div>`).join('');
    return;
  }

  wrap.className = 'ayat' + (hasText ? ' ayat--full' : '');
  wrap.innerHTML = state.verses.map((v, i) => `
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
'''
js = js[:start] + newfun + '\n\n/* ---------- teks ayat ---------- */' + js[end:]

needle = "  if (t.dataset.focus) {\n"
insert = "  if (t.dataset.mark) {\n    const ayahNo = +t.dataset.mark;\n    const current = state.surah ? getMarker(state.surah.id) : 0;\n    if (!state.surah) return;\n    if (current === ayahNo) {\n      clearMarker(state.surah.id);\n      toast('Penanda hafalan dihapus');\n    } else {\n      setMarker(state.surah.id, ayahNo);\n      toast(`Penanda hafalan: ayat ${ayahNo}`);\n    }\n    renderVerses();\n    renderMarkerSummary();\n    renderGrid();\n    return;\n  }\n\n  if (t.id === 'btnClearMarker') {\n    if (state.surah) {\n      clearMarker(state.surah.id);\n      renderVerses();\n      renderMarkerSummary();\n      renderGrid();\n      toast('Penanda hafalan dihapus');\n    }\n    return;\n  }\n\n" + needle
js = replace_once(js, needle, insert, 'mark click handler')
app.write_text(js)

# ---------- data.js icon remap ----------
data = root / 'data.js'
d = data.read_text()
icon_map = {
    114: 'people', 113: 'sunrise', 112: 'heart', 111: 'palm', 110: 'hands',
    109: 'people', 108: 'cloud', 107: 'hands', 106: 'camel', 105: 'elephant',
    104: 'people', 103: 'sun', 102: 'scale', 101: 'quake', 100: 'horse',
    99: 'quake', 98: 'book', 97: 'stars', 96: 'book', 95: 'sun', 94: 'heart',
    93: 'sunrise', 92: 'moon', 91: 'sun', 90: 'city', 89: 'sunrise',
    88: 'cloud', 87: 'sun', 86: 'stars', 85: 'stars', 84: 'cloud', 83: 'scale',
    82: 'cloud', 81: 'sun', 80: 'people', 79: 'stars', 78: 'book'
}
for sid, sym in icon_map.items():
    d = re.sub(rf'(id:\s*{sid},[^\n]*sym:\s*")[^"]+("[^\n]*)', rf'\1{sym}\2', d, count=1)
data.write_text(d)

# ---------- app.css ----------
css = root / 'app.css'
c = css.read_text()
c += r'''

/* Hafizku v8 — cleanup opening layout, markers, install icon */
.top { padding: 14px 16px; gap: 14px; }
.brand { flex: 1 1 auto; min-width: 0; }
.brand > div:last-child { min-width: 0; }
.brand__name { font-size: clamp(1.55rem, 5.2vw, 2.15rem); }
.brand__sub { margin-top: 2px; font-size: .78rem; }
.sky { width: 112px; min-width: 112px; height: 60px; border-radius: 22px; }
.sky__count { font-size: 2rem; right: 16px; }
.bar { display: grid; grid-template-columns: 78px 78px minmax(0, 1fr); gap: 12px; align-items: stretch; margin-top: 14px; }
.bar__spacer { display: none; }
.bar .btn { min-height: 72px; justify-content: center; }
.bar #btnBack .lbl { display: none; }
.bar #btnSave { width: auto; }
.bar #btnAll { width: 100%; border-radius: 26px; }
.hero { margin-top: 14px; gap: 12px 14px; align-items: center; }
.hero__text { min-width: 0; }
.hero__meta { font-size: .95rem; }
.hero__ar { width: 100%; text-align: right; }
.marker-panel { margin-top: 12px; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; border-radius: 24px; background: rgba(255,255,255,.92); box-shadow: 0 6px 0 rgba(103,126,147,.08), 0 14px 28px rgba(71,93,112,.06); border: 1px solid rgba(181,203,223,.8); }
.marker-panel__text b, .marker-panel__text span { display:block; }
.marker-panel__text b { color:#38437a; }
.marker-panel__text span { color:#71819a; font-size:.92rem; margin-top:2px; }
.btn--soft { background: linear-gradient(135deg,#fff5f8,#fff); border-color: #f0d7e4; color: #985a76; }
.card__badges { display:flex; gap:6px; flex-wrap:wrap; justify-content:flex-end; }
.card__badge--marker { background: linear-gradient(135deg,#fff6dc,#fff0bd); color:#946500; border:1px solid rgba(233,194,82,.65); padding:4px 8px; min-height: 0; }
.card__badge--marker span { font-size:.7rem; font-weight:800; }
.ayat--numbers { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.ayah-card, .ayah-wrap { position: relative; }
.ayah-card.is-marked .ayah-number, .ayah-wrap.is-marked .ayah { border-color:#f0c35a; background:linear-gradient(180deg,#fffdf4,#fff8df); }
.ayah-card.is-marked::after, .ayah-wrap.is-marked::after { content:"Sedang dihafal"; position:absolute; top:-8px; left:16px; background:#ffd66b; color:#7b5700; font-size:.7rem; font-weight:800; padding:3px 10px; border-radius:999px; box-shadow:0 4px 10px rgba(194,150,29,.18); }
.ayah-number { width: 100%; min-height: 96px; aspect-ratio: auto; border-radius: 24px; padding: 16px 12px 14px; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 6px; }
.ayah-number .ayah__no { width: 56px; height: 56px; border-radius: 18px; font-size: 24px; }
.ayah-number__label { font-size:.92rem; font-weight:800; color:#4a627c; }
.ayah-mark-btn { position: absolute; right: 10px; top: 10px; z-index: 2; display: inline-flex; align-items: center; gap: 6px; min-height: 38px; padding: 8px 10px; border-radius: 14px; border: 2px solid #f0dca1; background: rgba(255,251,235,.96); color: #9a7620; box-shadow: 0 4px 0 rgba(206,184,122,.18); font: inherit; font-size: .8rem; font-weight: 800; }
.ayah-mark-btn .ico { width: 18px; height: 18px; }
.ayah-mark-btn.is-on { border-color:#e1b33c; background: linear-gradient(135deg,#ffeaa1,#ffd76f); color:#7a5200; }
.ayat--full .ayah-wrap { display:block; }
.ayat--full .ayah-mark-btn { top: 12px; right: 12px; }
.ayat--full .ayah { padding-right: 108px; }
@media (max-width: 620px) {
  .top { align-items: stretch; }
  .sky { width: 104px; min-width: 104px; }
  .bar { grid-template-columns: 70px 70px minmax(0,1fr); gap: 10px; }
}
@media (max-width: 480px) {
  .top { padding: 12px 14px; }
  .sky { width: 94px; min-width: 94px; height: 56px; border-radius: 20px; }
  .sky__count { font-size: 1.8rem; right: 14px; }
  .bar { grid-template-columns: 64px 64px minmax(0,1fr); }
  .bar .btn { min-height: 64px; }
  .marker-panel { align-items:flex-start; flex-direction:column; }
  .marker-panel .btn { width:100%; justify-content:center; }
  .ayat--numbers { grid-template-columns: 1fr 1fr; }
  .ayah-number { min-height: 90px; }
  .ayah-mark-btn span { display:none; }
}
@media (max-width: 360px) { .ayat--numbers { grid-template-columns: 1fr; } }
'''
css.write_text(c)

# ---------- sw cache bust ----------
sw = root / 'sw.js'
swv = sw.read_text()
swv = re.sub(r"const VERSION = 'v\d+';", "const VERSION = 'v8';", swv, count=1)
sw.write_text(swv)

print('Hafizku v8 refinements applied')
