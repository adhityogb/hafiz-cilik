/* Audio compatibility fix for Hafiz Cilik.
 * Uses The Quran Project's GitHub Pages mirror as the primary verse-audio source.
 * Pattern documented by quranapi.pages.dev:
 * https://the-quran-project.github.io/Quran-Audio/Data/{reciter}/{surah}_{ayah}.mp3
 */

let hcAudioSourceAttempt = 0;

function hcReciterId() {
  // The mirror supports five reciters. Existing Hafiz Cilik qari names do not map
  // one-to-one, so use Mishary Alafasy as the reliable mobile fallback.
  return 1;
}

function hcPrimaryAudioUrl(idx) {
  const verse = state.verses[idx];
  return `https://the-quran-project.github.io/Quran-Audio/Data/${hcReciterId()}/${state.surah.id}_${verse.no}.mp3`;
}

function hcSecondaryAudioUrl(idx) {
  const verse = state.verses[idx];
  const surah = String(state.surah.id).padStart(3, '0');
  const ayah = String(verse.no).padStart(3, '0');
  return `https://verses.quran.foundation/Alafasy/mp3/${surah}${ayah}.mp3`;
}

function hcAudioSources(idx) {
  return [hcPrimaryAudioUrl(idx), hcSecondaryAudioUrl(idx)];
}

function start(idx, sourceIndex = 0) {
  const a = makeAudio();
  unlocked = true;
  hcAudioSourceAttempt = sourceIndex;

  // crossOrigin is unnecessary for ordinary HTMLAudioElement playback and can
  // make Safari reject otherwise playable media when CDN CORS headers vary.
  try { a.removeAttribute('crossorigin'); } catch (_) {}
  try { a.crossOrigin = null; } catch (_) {}

  const sources = hcAudioSources(idx);
  a.src = sources[Math.min(sourceIndex, sources.length - 1)];
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
}

function onAudioError() {
  const cur = state.playing;
  const idx = cur ? cur.idx : null;

  if (cur && idx !== null) {
    const sources = hcAudioSources(idx);
    const next = hcAudioSourceAttempt + 1;
    if (next < sources.length) {
      const st = statusOf(idx);
      if (st) st.textContent = 'Mencoba sumber suara cadangan…';
      start(idx, next);
      return;
    }
  }

  stopAll();
  if (idx !== null) {
    const st = statusOf(idx);
    if (st) st.textContent = navigator.onLine
      ? 'Suara belum bisa dimuat. Coba muat ulang halaman.'
      : 'Suara ini belum tersimpan. Sambungkan internet dulu.';
  }
}

function warm(idx) {
  const v = state.verses[idx];
  if (!v) return;
  hcAudioSources(idx).forEach(url => {
    fetch(url, { mode: 'no-cors', cache: 'force-cache' }).catch(() => {});
  });
}
