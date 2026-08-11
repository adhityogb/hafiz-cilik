from pathlib import Path
import re, sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else '_site')
BUILD = '9.1'

# Cache-bust the exact assets loaded by the page. This makes even an older
# service worker miss its old cache entries and fetch the new v9 UI.
index = root / 'index.html'
h = index.read_text()
h = re.sub(r'href="app\.css(?:\?v=[^"]+)?"', f'href="app.css?v={BUILD}"', h)
h = re.sub(r'href="manifest\.webmanifest(?:\?v=[^"]+)?"', f'href="manifest.webmanifest?v={BUILD}"', h)
h = re.sub(r'src="data\.js(?:\?v=[^"]+)?"', f'src="data.js?v={BUILD}"', h)
h = re.sub(r'src="app\.js(?:\?v=[^"]+)?"', f'src="app.js?v={BUILD}"', h)
if 'name="hafizku-build"' not in h:
    h = h.replace('</head>', f'<meta name="hafizku-build" content="v{BUILD}">\n</head>', 1)
else:
    h = re.sub(r'<meta name="hafizku-build" content="[^"]+">', f'<meta name="hafizku-build" content="v{BUILD}">', h)
index.write_text(h)

# Force Safari/PWA to bypass HTTP cache when checking the service worker.
app = root / 'app.js'
js = app.read_text()
old = "navigator.serviceWorker.register('sw.js').catch(() => {});"
new = f"navigator.serviceWorker.register('sw.js?v={BUILD}', {{ updateViaCache: 'none' }}).then(reg => reg.update()).catch(() => {{}});"
if old in js:
    js = js.replace(old, new, 1)
elif "navigator.serviceWorker.register('sw.js?v=" in js:
    js = re.sub(r"navigator\.serviceWorker\.register\('sw\.js\?v=[^']+'[^;]+;", new, js, count=1)
else:
    raise SystemExit('service worker registration not found')
app.write_text(js)

# Update shell version and pre-cache the versioned assets actually referenced
# by index.html, preserving offline behavior while avoiding stale asset hits.
sw = root / 'sw.js'
s = sw.read_text()
s = re.sub(r"const VERSION = '[^']+';", "const VERSION = 'v9.1';", s, count=1)
s = s.replace("  './app.css',", f"  './app.css?v={BUILD}',")
s = s.replace("  './app.js',", f"  './app.js?v={BUILD}',")
s = s.replace("  './data.js',", f"  './data.js?v={BUILD}',")
s = s.replace("  './manifest.webmanifest',", f"  './manifest.webmanifest?v={BUILD}',")
sw.write_text(s)

# Marker UX cleanup: keep memorization marking useful without squeezing Quran
# text or adding a large empty panel. The summary is only shown once marked.
css = root / 'app.css'
c = css.read_text()
c += r'''

/* Hafizku v9.1 — cache delivery + cleaner memorization marker */
.marker-panel {
  padding: 10px 14px !important;
  min-height: 0 !important;
  border-radius: 18px !important;
  border: 2px solid #FDE68A !important;
  background: #FFFBEB !important;
  box-shadow: 0 4px 0 rgba(217,119,6,.10) !important;
}
.marker-panel__text { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.marker-panel__text b { color:#92400E !important; font-size:.88rem; }
.marker-panel__text span { color:#B45309 !important; font-size:.84rem !important; margin:0 !important; }
.marker-panel .btn { min-height:36px !important; padding:7px 10px !important; border-radius:12px !important; }

/* In text mode the bookmark no longer overlays/narrows Arabic or translation. */
.ayat--full .ayah-wrap {
  display:flex !important;
  flex-direction:column !important;
  position:relative !important;
}
.ayat--full .ayah {
  width:100% !important;
  padding-right:18px !important;
}
.ayat--full .ayah-mark-btn {
  position:static !important;
  align-self:flex-end !important;
  transform:none !important;
  margin:-10px 14px 12px 0 !important;
  min-height:38px !important;
  padding:7px 11px !important;
  border-radius:13px !important;
  background:#FFF9E8 !important;
  border:2px solid #F4D77C !important;
  color:#9A6C10 !important;
  box-shadow:0 3px 0 rgba(199,154,48,.14) !important;
}
.ayat--full .ayah-mark-btn.is-on {
  background:#FDE68A !important;
  border-color:#F59E0B !important;
  color:#78350F !important;
}
.ayah-wrap.is-marked::after {
  display:none !important;
}
.ayah-wrap.is-marked .ayah {
  border-color:#FDE68A !important;
  box-shadow:0 6px 0 rgba(245,158,11,.10) !important;
}

/* Number-only mode: one large row per ayah, vertical scroll. */
.ayat--numbers {
  display:flex !important;
  flex-direction:column !important;
  gap:14px !important;
  width:100% !important;
}
.ayat--numbers .ayah-card { width:100% !important; }
.ayat--numbers .ayah-number { width:100% !important; }

/* Prevent the old v8 card look from winning through specificity. */
#grid .card {
  border-width:3px 3px 8px !important;
  border-style:solid !important;
  background:var(--kid-card) !important;
  border-color:var(--kid-edge) !important;
  color:var(--kid-ink) !important;
}
'''
css.write_text(c)

# Hide the marker summary entirely until a verse has been marked.
js = app.read_text()
old = """  if (ayah) {
    text.textContent = `Hafalan saat ini: ayat ${ayah}`;
    btn.classList.remove('hidden');
  } else {
    text.textContent = 'Belum ada penanda untuk surah ini.';
    btn.classList.add('hidden');
  }
}"""
new = """  const panel = $('markerPanel');
  if (ayah) {
    text.textContent = `Ayat ${ayah}`;
    btn.classList.remove('hidden');
    if (panel) panel.classList.remove('hidden');
  } else {
    text.textContent = '';
    btn.classList.add('hidden');
    if (panel) panel.classList.add('hidden');
  }
}"""
if old not in js:
    raise SystemExit('marker summary block not found')
js = js.replace(old, new, 1)
app.write_text(js)

print('Hafizku v9.1 forced-live hotfix applied')
