from pathlib import Path
import re, sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else '_site')

# Keep app logic intact; add a play cue to the number-only layout so the full-width
# row reads clearly as an audio button.
app = root / 'app.js'
js = app.read_text()
old = '''          <span class="ayah__no">${v.no}</span>
          <span class="ayah-number__label">Ayat ${v.no}</span>
          <span class="sr-only" data-status="${i}">Ayat ${v.no}</span>'''
new = '''          <span class="ayah__no">${v.no}</span>
          <span class="ayah-number__label">Ayat ${v.no}<small>Tekan untuk dengar</small></span>
          <span class="ayah-number__play" data-cue="${i}">${icon('i-play')}</span>
          <span class="sr-only" data-status="${i}">Ayat ${v.no}</span>'''
if old not in js:
    raise SystemExit('number-only ayah markup not found')
js = js.replace(old, new, 1)
app.write_text(js)

css = root / 'app.css'
c = css.read_text()
c += r'''

/* Hafizku v9 — bright kid palette inspired by supplied reference */
:root {
  --kid-yellow:#FDE047;
  --kid-orange:#FB923C;
  --kid-pink:#F472B6;
  --kid-blue:#38BDF8;
  --kid-green:#4ADE80;
  --kid-purple:#C084FC;
  --kid-sky-bg:#E0F2FE;
  --kid-sky-dot:#BAE6FD;
}
body {
  background-color: var(--kid-sky-bg);
  background-image: radial-gradient(var(--kid-sky-dot) 2px, transparent 2px);
  background-size: 24px 24px;
}
.top {
  background:#fff;
  border:4px solid var(--kid-blue);
  box-shadow:0 9px 0 rgba(14,116,144,.13),0 16px 30px rgba(15,84,112,.10);
}
.brand__mark {
  background:linear-gradient(145deg,#FEF08A,#FDE047);
  border:2px solid #F59E0B;
  color:#8A5B05;
  box-shadow:0 5px 0 #E5A716,0 9px 18px rgba(180,123,0,.14);
  transform:rotate(-5deg);
}
.brand__name { color:#0284C7; }
.brand__sub { color:#38A8DE; }
.sky {
  background:#FEF3C7 !important;
  background-image:none !important;
  border:2px solid #FCD34D;
  color:#D97706;
  box-shadow:inset 0 -5px 0 rgba(245,158,11,.08);
}
.sky__moon { color:#F59E0B; }
.sky__count { color:#D97706; }
.lede {
  text-align:center;
  background:rgba(255,255,255,.72);
  border:2px solid rgba(255,255,255,.96);
  box-shadow:none;
}
.lede h2 { color:#075985; }
.lede p { color:#0EA5E9; }
.levels { justify-content:center; }
.chip {
  background:#fff;
  border:2px solid #7DD3FC;
  color:#0369A1;
  box-shadow:0 4px 0 #BAE6FD;
}
.chip[aria-pressed="true"] {
  background:#FDE047;
  border-color:#F59E0B;
  color:#78350F;
  box-shadow:0 4px 0 #D97706;
}
.card {
  --kid-card:#FEF3C7;
  --kid-edge:#F59E0B;
  --kid-ink:#78350F;
  background:var(--kid-card) !important;
  color:var(--kid-ink) !important;
  border:3px solid var(--kid-edge) !important;
  border-bottom-width:8px !important;
  min-height:150px;
  padding:15px 14px 13px;
  align-items:center;
  justify-content:center;
  text-align:center;
  box-shadow:0 7px 14px rgba(48,72,94,.10) !important;
}
.card:hover { transform:translateY(-4px) scale(1.01); }
.card:active { transform:translateY(4px) scale(.97); border-bottom-width:4px !important; }
.card:nth-child(12n+1)  { --kid-card:#FEF3C7; --kid-edge:#F59E0B; --kid-ink:#78350F; }
.card:nth-child(12n+2)  { --kid-card:#BAE6FD; --kid-edge:#38BDF8; --kid-ink:#0C4A6E; }
.card:nth-child(12n+3)  { --kid-card:#FBCFE8; --kid-edge:#F472B6; --kid-ink:#831843; }
.card:nth-child(12n+4)  { --kid-card:#BBF7D0; --kid-edge:#4ADE80; --kid-ink:#14532D; }
.card:nth-child(12n+5)  { --kid-card:#E9D5FF; --kid-edge:#C084FC; --kid-ink:#581C87; }
.card:nth-child(12n+6)  { --kid-card:#FED7AA; --kid-edge:#FB923C; --kid-ink:#7C2D12; }
.card:nth-child(12n+7)  { --kid-card:#FEF08A; --kid-edge:#EAB308; --kid-ink:#713F12; }
.card:nth-child(12n+8)  { --kid-card:#BFDBFE; --kid-edge:#60A5FA; --kid-ink:#1E3A8A; }
.card:nth-child(12n+9)  { --kid-card:#CCFBF1; --kid-edge:#2DD4BF; --kid-ink:#134E4A; }
.card:nth-child(12n+10) { --kid-card:#E2E8F0; --kid-edge:#94A3B8; --kid-ink:#334155; }
.card:nth-child(12n+11) { --kid-card:#FECACA; --kid-edge:#F87171; --kid-ink:#7F1D1D; }
.card:nth-child(12n+12) { --kid-card:#DCFCE7; --kid-edge:#22C55E; --kid-ink:#14532D; }
.card::after { display:none; }
.card__head { width:100%; justify-content:center; position:relative; }
.card__grow { display:none; }
.card__no {
  position:absolute;
  top:0; right:0;
  background:rgba(255,255,255,.72);
  color:inherit;
}
.card__badges { position:absolute; top:0; left:0; }
.card__sym {
  width:58px !important;
  height:58px !important;
  padding:12px;
  border-radius:20px;
  background:rgba(255,255,255,.68) !important;
  color:inherit !important;
  box-shadow:0 4px 0 rgba(255,255,255,.45) !important;
}
.card__ar { color:inherit !important; margin-top:4px; }
.card__name { color:inherit !important; font-size:1.12rem; }
.card__meta,.card__meaning { color:inherit !important; opacity:.76; }
.bar {
  background:rgba(255,255,255,.94);
  border:2px solid #fff;
  box-shadow:0 7px 0 rgba(125,211,252,.45),0 13px 24px rgba(14,116,144,.09);
}
#btnBack { background:#F472B6; border-color:#DB2777; color:#fff; box-shadow:0 5px 0 #BE185D; }
#btnSave { background:#fff; border-color:#7DD3FC; color:#075985; box-shadow:0 5px 0 #BAE6FD; }
.btn--go { background:#4ADE80; border-color:#16A34A; color:#14532D; box-shadow:0 6px 0 #16A34A,0 10px 20px rgba(34,197,94,.16); }
.hero {
  background:rgba(255,255,255,.82) !important;
  border:2px solid #BAE6FD !important;
  box-shadow:0 7px 0 rgba(125,211,252,.38),0 12px 24px rgba(14,116,144,.07) !important;
}
.hero__sym { background:#E0F2FE; color:#0284C7; }
.ayat--numbers {
  display:grid !important;
  grid-template-columns:1fr !important;
  gap:14px !important;
}
.ayat--numbers .ayah-card { width:100%; }
.ayat--numbers .ayah-number {
  width:100%;
  min-height:92px;
  border-radius:24px;
  padding:14px 72px 14px 14px;
  display:grid;
  grid-template-columns:64px minmax(0,1fr) 48px;
  align-items:center;
  gap:14px;
  text-align:left;
  background:#fff;
  border:3px solid #BAE6FD;
  border-bottom-width:7px;
  box-shadow:0 8px 16px rgba(14,116,144,.08);
}
.ayat--numbers .ayah-number:active {
  transform:translateY(3px) scale(.985);
  border-bottom-width:4px;
}
.ayat--numbers .ayah-number .ayah__no {
  width:58px;
  height:58px;
  border-radius:18px;
  background:#38BDF8;
  border:2px solid #7DD3FC;
  color:#fff;
  box-shadow:0 4px 0 #0284C7;
  font-size:1.5rem;
}
.ayah-number__label {
  display:flex;
  flex-direction:column;
  gap:2px;
  color:#334155;
  font-size:1.12rem;
  font-weight:800;
}
.ayah-number__label small { color:#0EA5E9; font-size:.76rem; font-weight:800; }
.ayah-number__play {
  width:46px;
  height:46px;
  border-radius:16px;
  display:grid;
  place-items:center;
  background:#E0F2FE;
  color:#0284C7;
}
.ayah-number__play .ico { width:24px; height:24px; }
.ayat--numbers .ayah-card:nth-child(6n+2) .ayah-number { border-color:#FBCFE8; }
.ayat--numbers .ayah-card:nth-child(6n+2) .ayah__no { background:#F472B6; border-color:#F9A8D4; box-shadow:0 4px 0 #DB2777; }
.ayat--numbers .ayah-card:nth-child(6n+2) .ayah-number__play { background:#FCE7F3; color:#DB2777; }
.ayat--numbers .ayah-card:nth-child(6n+3) .ayah-number { border-color:#BBF7D0; }
.ayat--numbers .ayah-card:nth-child(6n+3) .ayah__no { background:#4ADE80; border-color:#86EFAC; box-shadow:0 4px 0 #16A34A; color:#14532D; }
.ayat--numbers .ayah-card:nth-child(6n+3) .ayah-number__play { background:#DCFCE7; color:#16A34A; }
.ayat--numbers .ayah-card:nth-child(6n+4) .ayah-number { border-color:#E9D5FF; }
.ayat--numbers .ayah-card:nth-child(6n+4) .ayah__no { background:#C084FC; border-color:#D8B4FE; box-shadow:0 4px 0 #9333EA; color:#581C87; }
.ayat--numbers .ayah-card:nth-child(6n+4) .ayah-number__play { background:#F3E8FF; color:#9333EA; }
.ayat--numbers .ayah-card:nth-child(6n+5) .ayah-number { border-color:#FDE68A; }
.ayat--numbers .ayah-card:nth-child(6n+5) .ayah__no { background:#FDE047; border-color:#FACC15; box-shadow:0 4px 0 #CA8A04; color:#713F12; }
.ayat--numbers .ayah-card:nth-child(6n+5) .ayah-number__play { background:#FEF9C3; color:#CA8A04; }
.ayat--numbers .ayah-card:nth-child(6n+6) .ayah-number { border-color:#FED7AA; }
.ayat--numbers .ayah-card:nth-child(6n+6) .ayah__no { background:#FB923C; border-color:#FDBA74; box-shadow:0 4px 0 #EA580C; color:#7C2D12; }
.ayat--numbers .ayah-card:nth-child(6n+6) .ayah-number__play { background:#FFEDD5; color:#EA580C; }
.ayat--numbers .ayah-mark-btn {
  top:50%;
  right:14px;
  transform:translateY(-50%);
  width:42px;
  height:42px;
  min-height:42px;
  padding:0;
  justify-content:center;
  border-radius:14px;
}
.ayat--numbers .ayah-card.is-marked::after { left:82px; top:-8px; }
.ayat--numbers .ayah-card.is-marked .ayah-number { background:#FEFCE8; border-color:#FACC15; }
@media (max-width:480px) {
  .grid { grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
  .card { min-height:144px; }
  .ayat--numbers .ayah-number { min-height:88px; grid-template-columns:58px minmax(0,1fr) 42px; gap:11px; padding-left:12px; padding-right:66px; }
  .ayat--numbers .ayah-number .ayah__no { width:54px; height:54px; }
}
@media (max-width:350px) { .grid { grid-template-columns:1fr; } }
'''
css.write_text(c)

sw = root / 'sw.js'
s = sw.read_text()
s = re.sub(r"const VERSION = 'v\d+';", "const VERSION = 'v9';", s, count=1)
sw.write_text(s)

index = root / 'index.html'
h = index.read_text().replace('<meta name="theme-color" content="#E8F2FD">', '<meta name="theme-color" content="#E0F2FE">')
index.write_text(h)

print('Hafizku v9 palette applied')
