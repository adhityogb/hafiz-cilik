from pathlib import Path
import re, sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else '_site')

# -----------------------------------------------------------------------------
# 1) Add a few purpose-built surah symbols so the illustrations reflect meaning
#    rather than reusing generic icons too often.
# -----------------------------------------------------------------------------
index = root / 'index.html'
s = index.read_text()
extra_symbols = r'''
    <symbol id="s-river" viewBox="0 0 24 24"><path d="M3 7.5c2.5 1.8 5 1.8 7.5 0s5-1.8 7.5 0 3 1.8 3 1.8M3 12c2.5 1.8 5 1.8 7.5 0s5-1.8 7.5 0 3 1.8 3 1.8M3 16.5c2.5 1.8 5 1.8 7.5 0s5-1.8 7.5 0 3 1.8 3 1.8"/></symbol>
    <symbol id="s-mountain" viewBox="0 0 24 24"><path d="M2.8 19.2L9.3 7.5l2.6 4.1 2.1-3.1 7.2 10.7z"/><path d="M7.8 10.2l1.5 1.7 1.2-1.3"/></symbol>
    <symbol id="s-lightning" viewBox="0 0 24 24"><path d="M13.4 2.8L5.8 13h5.7l-1 8.2 7.7-11h-5.7z"/></symbol>
    <symbol id="s-fruit" viewBox="0 0 24 24"><path d="M12 8.5c-4.5 0-7 2.6-7 6.1 0 3.7 2.8 6.4 7 6.4s7-2.7 7-6.4c0-3.5-2.5-6.1-7-6.1z"/><path d="M12 8.4c-.3-2.3.7-4 3.2-5.1M12.8 5.1c1.7-.5 3.2-.2 4.4.9"/></symbol>
    <symbol id="s-face" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.2"/><path d="M8.2 9.2h.1M15.7 9.2h.1M8.6 16c2.2-1.4 4.5-1.4 6.8 0"/></symbol>
    <symbol id="s-skybreak" viewBox="0 0 24 24"><path d="M5.4 17.8a3.7 3.7 0 0 1 .5-7.3 5.2 5.2 0 0 1 9.9-1 4 4 0 0 1 2.7 7.7"/><path d="M13 8.4l-2.1 4h2.4l-1.6 4.2"/></symbol>
    <symbol id="s-rope" viewBox="0 0 24 24"><path d="M7 3.5c3.5 2 6.5 2 10 0M7 20.5c3.5-2 6.5-2 10 0"/><path d="M8.3 5.1c-2.7 3.2-2.7 10.6 0 13.8M15.7 5.1c2.7 3.2 2.7 10.6 0 13.8"/><path d="M8.2 8.2h7.6M7.6 12h8.8M8.2 15.8h7.6"/></symbol>
    <symbol id="s-spiral-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.5 1.5M17 17l1.5 1.5M18.5 5.5L17 7M7 17l-1.5 1.5"/><path d="M10 10.2c2.6-1.8 5.2 1.2 3.3 3.1-1.1 1.1-3 .5-3.1-.8"/></symbol>
'''
if 'id="s-river"' not in s:
    s = s.replace('  </defs>', extra_symbols + '  </defs>', 1)
index.write_text(s)

# -----------------------------------------------------------------------------
# 2) Map surahs to icons that better match their Indonesian meanings.
# -----------------------------------------------------------------------------
data = root / 'data.js'
d = data.read_text()
icon_map = {
    114: 'people',      # An-Nas - mankind
    113: 'sunrise',     # Al-Falaq - daybreak
    112: 'heart',       # Al-Ikhlas - sincerity/pure faith
    111: 'rope',        # Al-Masad - palm fibre/rope
    110: 'hands',       # An-Nasr - help/victory
    109: 'people',      # Al-Kafirun - people
    108: 'river',       # Al-Kawthar - abundance/river
    107: 'hands',       # Al-Ma'un - useful kindness
    106: 'camel',       # Quraysh - caravan/travel
    105: 'elephant',    # Al-Fil - elephant
    104: 'people',      # Al-Humazah - people/backbiting
    103: 'sun',         # Al-'Asr - time
    102: 'scale',       # At-Takathur - competing for more
    101: 'lightning',   # Al-Qari'ah - striking calamity
    100: 'horse',       # Al-'Adiyat - charging horses
    99: 'quake',        # Az-Zalzalah - earthquake
    98: 'book',         # Al-Bayyinah - clear evidence
    97: 'moon',         # Al-Qadr - night of decree
    96: 'book',         # Al-'Alaq - read/knowledge
    95: 'fruit',        # At-Tin - fig
    94: 'heart',        # Asy-Syarh - relief/expansion
    93: 'sunrise',      # Adh-Dhuha - morning brightness
    92: 'moon',         # Al-Lail - night
    91: 'sun',          # Asy-Syams - sun
    90: 'city',         # Al-Balad - city
    89: 'sunrise',      # Al-Fajr - dawn
    88: 'skybreak',     # Al-Ghasyiyah - overwhelming event
    87: 'mountain',     # Al-A'la - Most High
    86: 'stars',        # Ath-Thariq - night star
    85: 'stars',        # Al-Buruj - constellations
    84: 'skybreak',     # Al-Insyiqaq - sky split
    83: 'scale',        # Al-Muthaffifin - fraudulent measure
    82: 'skybreak',     # Al-Infithar - sky cleft
    81: 'spiral-sun',   # At-Takwir - sun folded up
    80: 'face',         # 'Abasa - he frowned
    79: 'stars',        # An-Nazi'at - unseen angels
    78: 'book',         # An-Naba' - great news
}
for sid, sym in icon_map.items():
    pattern = rf'(\{{\s*id:\s*{sid},.*?sym:\s*")[^"]+(".*?)\}})'
    d, n = re.subn(pattern, rf'\1{sym}\2}}', d, count=1)
    if not n:
        # The source uses aligned whitespace; use a simpler line-oriented fallback.
        d = re.sub(rf'(id:\s*{sid},[^\n]*sym:\s*")[^"]+("[^\n]*)', rf'\1{sym}\2', d, count=1)
data.write_text(d)

# -----------------------------------------------------------------------------
# 3) Child-friendly visual system: soft color, generous spacing, clearer cards.
# -----------------------------------------------------------------------------
css = root / 'app.css'
c = css.read_text()
c += r'''

/* Hafizku v7 — child-friendly polish */
:root {
  --hk-ink: #24324a;
  --hk-muted: #65758b;
  --hk-blue: #5bb8e8;
  --hk-lav: #8a78db;
  --hk-mint: #72cfa5;
  --hk-peach: #ffad7d;
  --hk-yellow: #ffd66b;
  --hk-pink: #f6a6c4;
  --hk-card: rgba(255,255,255,.94);
}
body {
  color: var(--hk-ink);
  background:
    radial-gradient(circle at 12% 8%, rgba(255,214,107,.28), transparent 27%),
    radial-gradient(circle at 92% 14%, rgba(138,120,219,.18), transparent 30%),
    linear-gradient(180deg, #f4fbff 0%, #f9f7ff 48%, #fff9f3 100%);
}
.wrap { max-width: 760px; }
.top { padding-top: max(14px, env(safe-area-inset-top)); }
.brand__mark {
  background: linear-gradient(145deg, #806ed6, #5f4db9);
  color: white;
  border: 3px solid rgba(255,255,255,.85);
  box-shadow: 0 7px 0 rgba(91,74,166,.16), 0 12px 24px rgba(78,64,145,.12);
}
.brand__name { color:#3f347d; letter-spacing:-.03em; }
.brand__sub { color:#6d7890; }
.lede {
  margin-top: 8px;
  padding: 18px 18px 14px;
  border-radius: 26px;
  background: linear-gradient(135deg, rgba(255,255,255,.96), rgba(245,240,255,.9));
  border: 1px solid rgba(137,119,218,.14);
  box-shadow: 0 10px 26px rgba(76,84,126,.07);
}
.lede h2 { color:#343066; letter-spacing:-.035em; }
.lede p { color:#738097; }
.levels { gap:8px; padding:10px 2px 4px; }
.chip {
  border: 1.5px solid #d9e4ee;
  background: rgba(255,255,255,.92);
  color:#40516a;
  box-shadow:0 4px 0 rgba(93,122,145,.08);
  transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
}
.chip[aria-pressed="true"] {
  border-color:#806fd4;
  background:linear-gradient(135deg,#eeeaff,#f8f6ff);
  color:#504196;
  box-shadow:0 5px 0 rgba(102,82,178,.14);
}
.chip:active { transform:translateY(2px); box-shadow:0 2px 0 rgba(93,122,145,.08); }
.grid { gap:14px; }
.card {
  border: 0;
  border-radius: 27px;
  background: var(--hk-card);
  box-shadow: 0 8px 0 rgba(104,130,151,.09), 0 16px 32px rgba(71,93,112,.08);
  overflow:hidden;
  position:relative;
}
.card::after {
  content:"";
  position:absolute;
  inset:0;
  border-radius:inherit;
  pointer-events:none;
  box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.85);
}
.card__sym {
  width:58px !important;
  height:58px !important;
  padding:13px;
  border-radius:20px;
  background:linear-gradient(145deg,#e8f6ff,#d9effd);
  color:#348cc4;
  box-shadow:0 5px 0 rgba(59,142,194,.12);
}
.card:nth-child(6n+2) .card__sym { background:linear-gradient(145deg,#f1edff,#e7e0ff); color:#755fc3; box-shadow:0 5px 0 rgba(117,95,195,.11); }
.card:nth-child(6n+3) .card__sym { background:linear-gradient(145deg,#e9fbf3,#d9f5e8); color:#3a9a6c; box-shadow:0 5px 0 rgba(58,154,108,.11); }
.card:nth-child(6n+4) .card__sym { background:linear-gradient(145deg,#fff1e8,#ffe2cf); color:#d87543; box-shadow:0 5px 0 rgba(216,117,67,.11); }
.card:nth-child(6n+5) .card__sym { background:linear-gradient(145deg,#fff8dd,#ffefb4); color:#bd8a1b; box-shadow:0 5px 0 rgba(189,138,27,.11); }
.card:nth-child(6n+6) .card__sym { background:linear-gradient(145deg,#fff0f6,#ffe0ec); color:#c25e86; box-shadow:0 5px 0 rgba(194,94,134,.11); }
.card__name { color:#273b57; font-weight:800; letter-spacing:-.02em; }
.card__ar { color:#3e5590; }
.card__meta { color:#75859a; }
.card.is-done { background:linear-gradient(135deg,#f4fff8,#ffffff); }
.card.is-done .card__sym { outline:3px solid rgba(80,181,122,.17); }
.hero {
  border-radius:30px;
  border:0;
  background:linear-gradient(135deg,#dff3ff 0%,#e9e5ff 55%,#fff1dc 100%);
  box-shadow:0 9px 0 rgba(83,116,145,.11),0 18px 34px rgba(63,86,107,.09);
}
.hero__sym {
  background:rgba(255,255,255,.7);
  padding:12px;
  border-radius:22px;
  color:#6353ae;
}
.rows .row, .ayah, .row--sum {
  border-color:rgba(114,145,169,.18);
  box-shadow:0 6px 0 rgba(105,132,151,.08);
}
.ayah__no {
  background:linear-gradient(145deg,#dff4ff,#c8eaff);
  border-color:#62b8e8;
  color:#2d6284;
}
.ayah__cue {
  background:linear-gradient(145deg,#f2efff,#e5defe);
  color:#6251af;
}
.btn--go {
  background:linear-gradient(135deg,#45b77b,#2f9662);
  box-shadow:0 6px 0 #24764d,0 10px 22px rgba(43,139,90,.2);
}
.btn--go:active { transform:translateY(3px); box-shadow:0 3px 0 #24764d; }
.dock .btn {
  border-color:#d9e4ee;
  background:rgba(255,255,255,.94);
  box-shadow:0 5px 0 rgba(103,126,147,.1);
}
.focus-opt { border-width:1.5px; }
.focus-opt[aria-pressed="true"] {
  background:linear-gradient(135deg,#f0edff,#e7f7ff);
  border-color:#8170d2;
}
.sheet__panel {
  background:linear-gradient(180deg,#fbfdff,#f8f5ff);
  border-radius:32px 32px 0 0;
}
.toast { border-radius:18px; }
@media (max-width:560px) {
  .grid { grid-template-columns:1fr 1fr; gap:11px; }
  .card { border-radius:23px; }
  .card__sym { width:52px !important; height:52px !important; border-radius:18px; }
}
@media (max-width:370px) {
  .grid { grid-template-columns:1fr; }
}
'''
css.write_text(c)

# Bump service worker cache so the visual refresh is visible immediately.
sw = root / 'sw.js'
swv = sw.read_text()
swv = re.sub(r"const VERSION = 'v\d+';", "const VERSION = 'v7';", swv, count=1)
sw.write_text(swv)

print('Hafizku child UI polish applied')
