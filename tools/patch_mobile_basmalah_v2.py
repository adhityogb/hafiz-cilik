from pathlib import Path
import re

TAG = '20260828b'

index_path = Path('index.html')
app_path = Path('app.js')
css_path = Path('app.css')
sw_path = Path('sw.js')

index = index_path.read_text(encoding='utf-8')
app = app_path.read_text(encoding='utf-8')
css = css_path.read_text(encoding='utf-8')
sw = sw_path.read_text(encoding='utf-8')

# 1) Cache-bust critical shell assets. This also bypasses an older controlling SW cache.
index = re.sub(r'href="\./app\.css(?:\?v=[^"]+)?"', f'href="./app.css?v={TAG}"', index)
index = re.sub(r'src="\./data\.js(?:\?v=[^"]+)?"', f'src="./data.js?v={TAG}"', index)
index = re.sub(r'src="\./app\.js(?:\?v=[^"]+)?"', f'src="./app.js?v={TAG}"', index)

# 2) Make Basmalah stripping robust for Quran Uthmani diacritics, bidi marks and the U+FDFD ligature.
start = app.index('function stripBasmalahArabic(text) {')
end = app.index('\n\nfunction toast(msg) {', start)
new_strip = r'''function stripBasmalahArabic(text) {
  const source = String(text || '').normalize('NFC').trim();
  if (!source) return '';

  // Some Quran sources may encode the complete Basmalah as the single ﷽ ligature.
  if (source[0] === '\uFDFD') return source.slice(1).trim();

  const target = 'بسماللهالرحمنالرحيم';
  let i = 0;
  let t = 0;
  const isIgnorable = ch => /[\s\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u200C-\u200F\u061C\uFEFF]/u.test(ch) || ch === 'ـ';
  const normalizedLetter = ch => 'ٱأإآ'.includes(ch) ? 'ا' : ch;

  while (t < target.length) {
    while (i < source.length && isIgnorable(source[i])) i++;
    if (i >= source.length || normalizedLetter(source[i]) !== target[t]) return source;
    i++;
    t++;
  }
  while (i < source.length && isIgnorable(source[i])) i++;
  return source.slice(i).replace(/^[۝۞،؛:،.\-–—]+/u, '').trim();
}'''
app = app[:start] + new_strip + app[end:]

# Persist cleanup for previously cached Quran text, not only the in-memory render.
old_cached = """  if (cached && cached.length === s.n) {\n    applyText(cached);\n    return;\n  }"""
new_cached = """  if (cached && cached.length === s.n) {\n    const cleaned = cached.map((row, i) => i === 0\n      ? { ...row, ar: stripBasmalahArabic(row && row.ar) }\n      : row);\n    const before = cached[0] && cached[0].ar ? cached[0].ar : '';\n    const after = cleaned[0] && cleaned[0].ar ? cleaned[0].ar : '';\n    if (before !== after) store.set('text:' + s.id, cleaned);\n    applyText(cleaned);\n    return;\n  }"""
if old_cached in app:
    app = app.replace(old_cached, new_cached, 1)
elif 'const cleaned = cached.map' not in app:
    raise RuntimeError('cached text branch not found')

# Give every ayah a stable tone class so inserting a standalone Basmalah does not shift colors.
app = app.replace('<div class="ayah-card ${marker === v.no ?', '<div class="ayah-card ayah-tone-${i % 6} ${marker === v.no ?', 1)
app = app.replace('<div class="ayah-wrap ${marker === v.no ?', '<div class="ayah-wrap ayah-tone-${i % 6} ${marker === v.no ?', 1)

# 3) Final mobile/readability overrides.
marker = '/* Mobile Arabic readability + fixed Basmalah v2 */'
if marker not in css:
    css += r'''

/* Mobile Arabic readability + fixed Basmalah v2 */
.ayah-tone-0{--ayah-bg:#BAE6FD;--ayah-edge:#38BDF8;--ayah-ink:#0C4A6E}
.ayah-tone-1{--ayah-bg:#FBCFE8;--ayah-edge:#F472B6;--ayah-ink:#831843}
.ayah-tone-2{--ayah-bg:#BBF7D0;--ayah-edge:#4ADE80;--ayah-ink:#14532D}
.ayah-tone-3{--ayah-bg:#E9D5FF;--ayah-edge:#C084FC;--ayah-ink:#581C87}
.ayah-tone-4{--ayah-bg:#FEF08A;--ayah-edge:#EAB308;--ayah-ink:#713F12}
.ayah-tone-5{--ayah-bg:#FED7AA;--ayah-edge:#FB923C;--ayah-ink:#7C2D12}

.basmalah,
.basmalah__ar,
.ayah,
.ayah__body,
.ayah__ar{overflow:visible}

.basmalah{
  margin:0 0 4px;
  padding:12px 16px 10px;
}
.basmalah__ar{
  padding:.08em 0 .12em;
  line-height:1.9;
}
.ayah__ar{
  line-height:2.12;
  padding:.10em 0 .16em;
}

@media(max-width:430px){
  :root{--dock-space:calc(138px + env(safe-area-inset-bottom))}
  .ayat{gap:13px;padding-bottom:var(--dock-space)}
  .basmalah{margin:0 0 5px;padding:9px 12px 7px;border-radius:18px}
  .basmalah__ar{font-size:1.86rem;line-height:1.95;padding:.10em 0 .14em}
  .ayat--full .ayah{
    grid-template-columns:44px minmax(0,1fr) 42px;
    gap:8px;
    padding:12px 10px 14px;
    align-items:start;
  }
  .ayat--full .ayah__no{width:44px;height:44px;border-radius:14px;font-size:1.2rem}
  .ayat--full .ayah__cue{width:42px;height:42px;border-radius:14px}
  .ayah__ar{font-size:1.74rem;line-height:2.18;padding:.12em 0 .18em;margin-bottom:4px}
  .ayah__latin{line-height:1.5}
  .ayah__id{line-height:1.55;margin-top:5px}
  .dock{
    background:none;
    padding:7px 16px calc(9px + env(safe-area-inset-bottom));
  }
  .dock .btn{
    background:rgba(255,255,255,.97);
    box-shadow:0 5px 0 rgba(125,211,252,.50),0 10px 22px rgba(22,50,79,.16);
  }
}
'''

# 4) New shell cache and versioned precache entries.
sw = re.sub(
    r"const VERSION = APP_VERSION \+ '-basmalah-arabic-v\d+-20260828';",
    "const VERSION = APP_VERSION + '-basmalah-arabic-v2-20260828';",
    sw,
    count=1,
)
sw = sw.replace(
    "'./','./index.html','./app.css','./app.js','./data.js','./manifest.webmanifest',",
    f"'./','./index.html','./app.css?v={TAG}','./app.js?v={TAG}','./data.js?v={TAG}','./manifest.webmanifest',",
    1,
)

# On activation, refresh an already-open standalone PWA once so it cannot keep running stale JS.
claim = '  await self.clients.claim();\n'
navigate = """  await self.clients.claim();\n  const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });\n  for (const client of windows) {\n    try {\n      const current = new URL(client.url);\n      if (current.origin === self.location.origin) await client.navigate(client.url);\n    } catch (error) {}\n  }\n"""
if 'includeUncontrolled: true' not in sw:
    if claim not in sw:
        raise RuntimeError('service-worker claim anchor not found')
    sw = sw.replace(claim, navigate, 1)

index_path.write_text(index, encoding='utf-8')
app_path.write_text(app, encoding='utf-8')
css_path.write_text(css, encoding='utf-8')
sw_path.write_text(sw, encoding='utf-8')

# Static checks
assert f'./app.css?v={TAG}' in index
assert f'./app.js?v={TAG}' in index
assert f'./data.js?v={TAG}' in index
assert 'const cleaned = cached.map' in app
assert 'ayah-tone-${i % 6}' in app
assert 'Mobile Arabic readability + fixed Basmalah v2' in css
assert 'basmalah-arabic-v2-20260828' in sw
assert f'./app.js?v={TAG}' in sw
assert 'includeUncontrolled: true' in sw
print('mobile Basmalah v2 patch applied')
