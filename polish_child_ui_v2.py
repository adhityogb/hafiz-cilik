from pathlib import Path
import sys
root = Path(sys.argv[1] if len(sys.argv) > 1 else '_site')
css = root / 'app.css'
c = css.read_text()
c += r'''

/* Hafizku v7b — child-friendly visual polish */
:root {
  --hk-ink:#24324a; --hk-blue:#5bb8e8; --hk-lav:#8a78db;
  --hk-mint:#72cfa5; --hk-peach:#ffad7d; --hk-yellow:#ffd66b; --hk-pink:#f6a6c4;
}
body {
  color:var(--hk-ink);
  background:
    radial-gradient(circle at 12% 8%, rgba(255,214,107,.28), transparent 27%),
    radial-gradient(circle at 92% 14%, rgba(138,120,219,.18), transparent 30%),
    linear-gradient(180deg,#f4fbff 0%,#f9f7ff 48%,#fff9f3 100%);
}
.wrap { max-width:760px; }
.brand__mark {
  background:linear-gradient(145deg,#806ed6,#5f4db9); color:#fff;
  border:3px solid rgba(255,255,255,.85);
  box-shadow:0 7px 0 rgba(91,74,166,.16),0 12px 24px rgba(78,64,145,.12);
  transform:none;
}
.brand__name { color:#3f347d; letter-spacing:-.03em; }
.brand__sub { color:#6d7890; }
.lede {
  margin-top:10px; padding:18px; border-radius:26px;
  background:linear-gradient(135deg,rgba(255,255,255,.96),rgba(245,240,255,.9));
  border:1px solid rgba(137,119,218,.14); box-shadow:0 10px 26px rgba(76,84,126,.07);
}
.lede h2 { color:#343066; letter-spacing:-.035em; }
.lede p { color:#738097; }
.levels { gap:8px; padding:10px 2px 4px; }
.chip {
  border:1.5px solid #d9e4ee; background:rgba(255,255,255,.92); color:#40516a;
  box-shadow:0 4px 0 rgba(93,122,145,.08);
}
.chip[aria-pressed="true"] {
  border-color:#806fd4; background:linear-gradient(135deg,#eeeaff,#f8f6ff);
  color:#504196; box-shadow:0 5px 0 rgba(102,82,178,.14);
}
.grid { gap:14px; }
.card {
  border:0; border-radius:27px; background:rgba(255,255,255,.94);
  box-shadow:0 8px 0 rgba(104,130,151,.09),0 16px 32px rgba(71,93,112,.08);
  overflow:hidden; position:relative;
}
.card::after { content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none; box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.85); }
.card__sym {
  width:58px!important; height:58px!important; padding:13px; border-radius:20px;
  background:linear-gradient(145deg,#e8f6ff,#d9effd); color:#348cc4;
  box-shadow:0 5px 0 rgba(59,142,194,.12);
}
.card:nth-child(6n+2) .card__sym { background:linear-gradient(145deg,#f1edff,#e7e0ff); color:#755fc3; }
.card:nth-child(6n+3) .card__sym { background:linear-gradient(145deg,#e9fbf3,#d9f5e8); color:#3a9a6c; }
.card:nth-child(6n+4) .card__sym { background:linear-gradient(145deg,#fff1e8,#ffe2cf); color:#d87543; }
.card:nth-child(6n+5) .card__sym { background:linear-gradient(145deg,#fff8dd,#ffefb4); color:#bd8a1b; }
.card:nth-child(6n+6) .card__sym { background:linear-gradient(145deg,#fff0f6,#ffe0ec); color:#c25e86; }
.card__name { color:#273b57; font-weight:800; letter-spacing:-.02em; }
.card__ar { color:#3e5590; }
.card__meta,.card__meaning { color:#75859a; }
.hero {
  border-radius:30px; border:0;
  background:linear-gradient(135deg,#dff3ff 0%,#e9e5ff 55%,#fff1dc 100%);
  box-shadow:0 9px 0 rgba(83,116,145,.11),0 18px 34px rgba(63,86,107,.09);
}
.hero__sym { background:rgba(255,255,255,.72); padding:12px; border-radius:22px; color:#6353ae; }
.rows .row,.ayah,.row--sum { border-color:rgba(114,145,169,.18); box-shadow:0 6px 0 rgba(105,132,151,.08); }
.btn--go { background:linear-gradient(135deg,#45b77b,#2f9662); box-shadow:0 6px 0 #24764d,0 10px 22px rgba(43,139,90,.2); }
.focus-opt[aria-pressed="true"] { background:linear-gradient(135deg,#f0edff,#e7f7ff); border-color:#8170d2; }
.sheet__panel { background:linear-gradient(180deg,#fbfdff,#f8f5ff); }
'''
css.write_text(c)
print('child UI polish applied')
