from pathlib import Path
import json, re, sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else '_site')
BUILD = '9.2'

# ---- app.js: feature flag OFF while preserving marker implementation ----
app = root / 'app.js'
js = app.read_text()
if 'const FEATURES = {' not in js:
    anchor = "const $ = id => document.getElementById(id);"
    if anchor not in js:
        raise SystemExit('app.js feature flag anchor not found')
    js = js.replace(anchor, anchor + "\n\nconst FEATURES = {\n  memorizationMarker: false\n};", 1)
else:
    js = re.sub(r'memorizationMarker:\s*(?:true|false)', 'memorizationMarker: false', js, count=1)

js = js.replace(
    "${getMarker(s.id) ? `<span class=\"card__badge card__badge--marker\">${icon('i-bookmark')}<span>Ayat ${getMarker(s.id)}</span></span>` : ''}",
    "${FEATURES.memorizationMarker && getMarker(s.id) ? `<span class=\"card__badge card__badge--marker\">${icon('i-bookmark')}<span>Ayat ${getMarker(s.id)}</span></span>` : ''}"
)

needle = "function renderMarkerSummary() {\n"
if needle not in js:
    raise SystemExit('renderMarkerSummary not found')
js = js.replace(needle, needle + "  if (!FEATURES.memorizationMarker) {\n    const panel = $('markerPanel');\n    if (panel) panel.classList.add('hidden');\n    return;\n  }\n", 1)

needle = "  if (t.dataset.mark) {\n"
if needle in js:
    js = js.replace(needle, "  if (t.dataset.mark) {\n    if (!FEATURES.memorizationMarker) return;\n", 1)

js = re.sub(
    r"navigator\.serviceWorker\.register\('sw\.js\?v=[^']+'\s*,\s*\{ updateViaCache: 'none' \}\)",
    f"navigator.serviceWorker.register('sw.js?v={BUILD}', {{ updateViaCache: 'none' }})",
    js,
    count=1
)
app.write_text(js)

# ---- index.html: cache-bust all shell and icon references ----
index = root / 'index.html'
h = index.read_text()
for name in ('app.css', 'manifest.webmanifest'):
    h = re.sub(rf'href="{re.escape(name)}(?:\?v=[^"]+)?"', f'href="{name}?v={BUILD}"', h)
for name in ('data.js', 'app.js'):
    h = re.sub(rf'src="{re.escape(name)}(?:\?v=[^"]+)?"', f'src="{name}?v={BUILD}"', h)
h = re.sub(r'href="icons/apple-touch-icon\.png(?:\?v=[^"]+)?"', f'href="icons/apple-touch-icon.png?v={BUILD}"', h)
h = re.sub(r'href="icons/favicon\.svg(?:\?v=[^"]+)?"', f'href="icons/favicon.svg?v={BUILD}"', h)
h = re.sub(r'<meta name="hafizku-build" content="[^"]+">', f'<meta name="hafizku-build" content="v{BUILD}">', h)
index.write_text(h)

# ---- manifest: new icon URLs ensure a fresh installed icon fetch ----
man = root / 'manifest.webmanifest'
m = json.loads(man.read_text())
for item in m.get('icons', []):
    base = item.get('src', '').split('?')[0]
    if base:
        item['src'] = f'{base}?v={BUILD}'
man.write_text(json.dumps(m, ensure_ascii=False, indent=2))

# ---- CSS: hide marker UI and create breathing room between filters/cards ----
css = root / 'app.css'
c = css.read_text()
c += r'''

/* Hafizku v9.2 — marker disabled + navigation spacing cleanup */
.marker-panel,
.ayah-mark-btn,
.card__badge--marker {
  display: none !important;
}

.levels {
  margin-top: 14px !important;
  margin-bottom: 22px !important;
  padding: 6px 4px 8px !important;
  gap: 10px !important;
  scroll-padding-inline: 4px;
}
#grid {
  margin-top: 0 !important;
  padding-top: 2px !important;
}
.chip {
  min-height: 48px;
  padding: 10px 16px !important;
  flex: 0 0 auto;
}
.chip small { margin-left: 5px; }
.lede { margin-bottom: 12px !important; }
.grid { padding-bottom: 112px !important; }

@media (max-width: 480px) {
  .levels { margin-bottom: 20px !important; }
  .chip { min-height: 46px; padding: 9px 14px !important; }
}
'''
css.write_text(c)

# ---- service worker: v9.2 and fresh versioned shell ----
sw = root / 'sw.js'
s = sw.read_text()
s = re.sub(r"const VERSION = '[^']+';", "const VERSION = 'v9.2';", s, count=1)
s = re.sub(r"'\./app\.css\?v=[^']+'", f"'./app.css?v={BUILD}'", s)
s = re.sub(r"'\./app\.js\?v=[^']+'", f"'./app.js?v={BUILD}'", s)
s = re.sub(r"'\./data\.js\?v=[^']+'", f"'./data.js?v={BUILD}'", s)
s = re.sub(r"'\./manifest\.webmanifest\?v=[^']+'", f"'./manifest.webmanifest?v={BUILD}'", s)
sw.write_text(s)

print('Hafizku v9.2 cleanup applied')
