from pathlib import Path

index_path = Path('index.html')
app_path = Path('app.js')
css_path = Path('app.css')
sw_path = Path('sw.js')

index = index_path.read_text(encoding='utf-8')
app = app_path.read_text(encoding='utf-8')
css = css_path.read_text(encoding='utf-8')
sw = sw_path.read_text(encoding='utf-8')

old_viewport = '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
new_viewport = '<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">'
assert old_viewport in index or new_viewport in index
index = index.replace(old_viewport, new_viewport, 1)
index = index.replace('./app.css?v=20260828b', './app.css?v=20260828c')
index = index.replace('./app.js?v=20260828b', './app.js?v=20260828c')
index = index.replace('./data.js?v=20260828b', './data.js?v=20260828c')

# Keep reward sparkles in a dedicated left zone so 3-digit counts stay readable.
app = app.replace("s.style.left = (6 + ((i * 37) % 108)) + 'px';", "s.style.left = (7 + ((i * 17) % 40)) + 'px';", 1)
app = app.replace("s.style.top = (7 + ((i * 19) % 34)) + 'px';", "s.style.top = (7 + ((i * 13) % 34)) + 'px';", 1)

zoom_marker = '/* ---------- kunci zoom PWA/mobile ---------- */'
if zoom_marker not in app:
    anchor = '/* ---------- pasang di layar utama ---------- */'
    assert anchor in app
    zoom_code = r'''/* ---------- kunci zoom PWA/mobile ---------- */
function lockAppZoom() {
  const preventGesture = event => event.preventDefault();
  ['gesturestart', 'gesturechange', 'gestureend'].forEach(type => {
    document.addEventListener(type, preventGesture, { passive: false });
  });

  document.addEventListener('touchmove', event => {
    if (event.touches && event.touches.length > 1) event.preventDefault();
  }, { passive: false });

  let lastTextTap = 0;
  document.addEventListener('touchend', event => {
    const interactive = event.target && event.target.closest && event.target.closest('button,a,input,select,textarea');
    const now = Date.now();
    if (!interactive && now - lastTextTap < 300) event.preventDefault();
    lastTextTap = now;
  }, { passive: false });
}
lockAppZoom();

'''
    app = app.replace(anchor, zoom_code + anchor, 1)

css_marker = '/* Mobile polish + zoom lock v3 */'
if css_marker not in css:
    css += r'''

/* Mobile polish + zoom lock v3 */
html,body{touch-action:pan-x pan-y}

@media(max-width:430px){
  :root{--dock-space:calc(104px + env(safe-area-inset-bottom))}

  /* Reward counter: keep decorations away from 2- and 3-digit totals. */
  .sky{width:106px;height:56px}
  .sky__count{right:10px;bottom:7px;font-size:1.58rem;line-height:1}
  .sky__moon{left:8px;top:8px;width:18px;height:18px}
  .sky__star{width:8px;height:8px}

  /* Basmalah gets a full line box so Amiri Quran marks never touch the card edge. */
  .basmalah{
    min-height:104px;
    display:flex;
    align-items:center;
    justify-content:center;
    margin:0 0 10px;
    padding:14px 14px 18px;
    overflow:visible;
  }
  .basmalah__ar{
    width:100%;
    font-size:1.80rem;
    line-height:1.82;
    padding:.16em .06em .24em;
    text-align:center;
    overflow:visible;
  }

  /* More breathing room for Quran text without making cards oversized. */
  .ayat{gap:14px;padding-bottom:var(--dock-space);scroll-padding-bottom:var(--dock-space)}
  .ayat--full .ayah{
    grid-template-columns:42px minmax(0,1fr) 40px;
    gap:8px;
    padding:13px 10px 16px;
  }
  .ayat--full .ayah__no{width:42px;height:42px;border-radius:14px;font-size:1.16rem}
  .ayat--full .ayah__cue{width:40px;height:40px;border-radius:13px}
  .ayah__body{min-width:0;overflow:visible}
  .ayah__ar{
    font-size:1.72rem;
    line-height:2.05;
    padding:.12em 0 .22em;
    margin-bottom:5px;
    overflow:visible;
  }
  .ayah__latin{line-height:1.5}
  .ayah__id{line-height:1.55;margin-top:5px}

  /* Settings stays available but no longer covers a large central area. */
  .dock{
    justify-content:flex-end;
    padding:8px 12px calc(10px + env(safe-area-inset-bottom));
    background:none;
  }
  .dock .btn{
    width:58px;
    height:58px;
    min-height:58px;
    padding:0;
    gap:0;
    border-radius:20px;
    font-size:0;
    background:rgba(255,255,255,.98);
    box-shadow:0 4px 0 rgba(125,211,252,.48),0 9px 20px rgba(22,50,79,.14);
  }
  .dock .btn .ico{width:27px;height:27px}
}
'''

sw = sw.replace("const VERSION = APP_VERSION + '-basmalah-arabic-v2-20260828';", "const VERSION = APP_VERSION + '-mobile-polish-zoom-v3-20260828';", 1)
sw = sw.replace('./app.css?v=20260828b', './app.css?v=20260828c')
sw = sw.replace('./app.js?v=20260828b', './app.js?v=20260828c')
sw = sw.replace('./data.js?v=20260828b', './data.js?v=20260828c')

index_path.write_text(index, encoding='utf-8')
app_path.write_text(app, encoding='utf-8')
css_path.write_text(css, encoding='utf-8')
sw_path.write_text(sw, encoding='utf-8')
print('mobile polish and zoom lock patch applied')
