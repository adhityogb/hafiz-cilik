/* Hafizku — data Juz 30 (surah 78–114)
 *
 * Ikon surat disimpan sebagai 37 file SVG individual di icons/surah/.
 * Sprite kecil di bawah hanya menjadi jembatan untuk API ikon lama di app.js,
 * jadi card dan hero tidak perlu dirombak. Setiap SVG memakai currentColor agar
 * warna ikon otomatis mengikuti warna card masing-masing surat.
 */
const SURAHS = [
  { id: 114, name: "An-Nas"          , ar: "الناس"     , meaning: "Manusia"              , start: 6231, n: 6 , sym: "nas"          , sky: "sky" },
  { id: 113, name: "Al-Falaq"        , ar: "الفلق"     , meaning: "Waktu Subuh"          , start: 6226, n: 5 , sym: "falaq"        , sky: "dawn" },
  { id: 112, name: "Al-Ikhlas"       , ar: "الإخلاص"   , meaning: "Memurnikan Iman"      , start: 6222, n: 4 , sym: "ikhlas"       , sky: "sun" },
  { id: 111, name: "Al-Masad"        , ar: "المسد"     , meaning: "Sabut Kurma"          , start: 6217, n: 5 , sym: "masad"        , sky: "dusk" },
  { id: 110, name: "An-Nasr"         , ar: "النصر"     , meaning: "Pertolongan"          , start: 6214, n: 3 , sym: "nasr"         , sky: "dawn" },
  { id: 109, name: "Al-Kafirun"      , ar: "الكافرون"  , meaning: "Orang Kafir"          , start: 6208, n: 6 , sym: "kafirun"      , sky: "dusk" },
  { id: 108, name: "Al-Kautsar"      , ar: "الكوثر"    , meaning: "Nikmat yang Banyak"   , start: 6205, n: 3 , sym: "kautsar"      , sky: "sky" },
  { id: 107, name: "Al-Ma'un"        , ar: "الماعون"   , meaning: "Barang Berguna"       , start: 6198, n: 7 , sym: "maun"         , sky: "garden" },
  { id: 106, name: "Quraisy"         , ar: "قريش"      , meaning: "Suku Quraisy"         , start: 6194, n: 4 , sym: "quraisy"      , sky: "sun" },
  { id: 105, name: "Al-Fil"          , ar: "الفيل"     , meaning: "Gajah"                , start: 6189, n: 5 , sym: "fil"          , sky: "dusk" },
  { id: 104, name: "Al-Humazah"      , ar: "الهمزة"    , meaning: "Pengumpat"            , start: 6180, n: 9 , sym: "humazah"      , sky: "dusk" },
  { id: 103, name: "Al-'Asr"         , ar: "العصر"     , meaning: "Waktu Asar"           , start: 6177, n: 3 , sym: "asr"          , sky: "sun" },
  { id: 102, name: "At-Takatsur"     , ar: "التكاثر"   , meaning: "Bermegah-megahan"     , start: 6169, n: 8 , sym: "takatsur"     , sky: "dusk" },
  { id: 101, name: "Al-Qari'ah"      , ar: "القارعة"   , meaning: "Hari Kiamat"          , start: 6158, n: 11, sym: "qariah"       , sky: "night" },
  { id: 100, name: "Al-'Adiyat"      , ar: "العاديات"  , meaning: "Kuda Perang"          , start: 6147, n: 11, sym: "adiyat"       , sky: "dawn" },
  { id: 99, name: "Az-Zalzalah"     , ar: "الزلزلة"   , meaning: "Kegoncangan"          , start: 6139, n: 8 , sym: "zalzalah"     , sky: "dusk" },
  { id: 98, name: "Al-Bayyinah"     , ar: "البينة"    , meaning: "Bukti Nyata"          , start: 6131, n: 8 , sym: "bayyinah"     , sky: "sky" },
  { id: 97, name: "Al-Qadr"         , ar: "القدر"     , meaning: "Malam Kemuliaan"      , start: 6126, n: 5 , sym: "qadr"         , sky: "night" },
  { id: 96, name: "Al-'Alaq"        , ar: "العلق"     , meaning: "Segumpal Darah"       , start: 6107, n: 19, sym: "alaq"         , sky: "sky" },
  { id: 95, name: "At-Tin"          , ar: "التين"     , meaning: "Buah Tin"             , start: 6099, n: 8 , sym: "tin"          , sky: "garden" },
  { id: 94, name: "Asy-Syarh"       , ar: "الشرح"     , meaning: "Kelapangan Hati"      , start: 6091, n: 8 , sym: "syarh"        , sky: "sky" },
  { id: 93, name: "Adh-Dhuha"       , ar: "الضحى"     , meaning: "Waktu Duha"           , start: 6080, n: 11, sym: "dhuha"        , sky: "sun" },
  { id: 92, name: "Al-Lail"         , ar: "الليل"     , meaning: "Malam"                , start: 6059, n: 21, sym: "lail"         , sky: "night" },
  { id: 91, name: "Asy-Syams"       , ar: "الشمس"     , meaning: "Matahari"             , start: 6044, n: 15, sym: "syams"        , sky: "sun" },
  { id: 90, name: "Al-Balad"        , ar: "البلد"     , meaning: "Negeri"               , start: 6024, n: 20, sym: "balad"        , sky: "dusk" },
  { id: 89, name: "Al-Fajr"         , ar: "الفجر"     , meaning: "Waktu Fajar"          , start: 5994, n: 30, sym: "fajr"         , sky: "dawn" },
  { id: 88, name: "Al-Ghasyiyah"    , ar: "الغاشية"   , meaning: "Hari Pembalasan"      , start: 5968, n: 26, sym: "ghasyiyah"    , sky: "night" },
  { id: 87, name: "Al-A'la"         , ar: "الأعلى"    , meaning: "Yang Maha Tinggi"     , start: 5949, n: 19, sym: "ala"          , sky: "sky" },
  { id: 86, name: "Ath-Thariq"      , ar: "الطارق"    , meaning: "Bintang Malam"        , start: 5932, n: 17, sym: "thariq"       , sky: "night" },
  { id: 85, name: "Al-Buruj"        , ar: "البروج"    , meaning: "Gugusan Bintang"      , start: 5910, n: 22, sym: "buruj"        , sky: "night" },
  { id: 84, name: "Al-Insyiqaq"     , ar: "الانشقاق"  , meaning: "Terbelah"             , start: 5885, n: 25, sym: "insyiqaq"     , sky: "dusk" },
  { id: 83, name: "Al-Muthaffifin"  , ar: "المطففين"  , meaning: "Orang Curang"         , start: 5849, n: 36, sym: "muthaffifin"  , sky: "dusk" },
  { id: 82, name: "Al-Infithar"     , ar: "الانفطار"  , meaning: "Langit Terbelah"      , start: 5830, n: 19, sym: "infithar"     , sky: "dusk" },
  { id: 81, name: "At-Takwir"       , ar: "التكوير"   , meaning: "Menggulung"           , start: 5801, n: 29, sym: "takwir"       , sky: "dusk" },
  { id: 80, name: "'Abasa"          , ar: "عبس"       , meaning: "Bermuka Masam"        , start: 5759, n: 42, sym: "abasa"        , sky: "garden" },
  { id: 79, name: "An-Nazi'at"      , ar: "النازعات"  , meaning: "Malaikat Pencabut"    , start: 5713, n: 46, sym: "naziat"       , sky: "night" },
  { id: 78, name: "An-Naba'"        , ar: "النبأ"     , meaning: "Berita Besar"         , start: 5673, n: 40, sym: "naba"         , sky: "sky" },
];

const SURAH_ICON_FILES = Object.freeze({
  nas: "./icons/surah/114-an-nas.svg",
  falaq: "./icons/surah/113-al-falaq.svg",
  ikhlas: "./icons/surah/112-al-ikhlas.svg",
  masad: "./icons/surah/111-al-masad.svg",
  nasr: "./icons/surah/110-an-nasr.svg",
  kafirun: "./icons/surah/109-al-kafirun.svg",
  kautsar: "./icons/surah/108-al-kautsar.svg",
  maun: "./icons/surah/107-al-maun.svg",
  quraisy: "./icons/surah/106-quraisy.svg",
  fil: "./icons/surah/105-al-fil.svg",
  humazah: "./icons/surah/104-al-humazah.svg",
  asr: "./icons/surah/103-al-asr.svg",
  takatsur: "./icons/surah/102-at-takatsur.svg",
  qariah: "./icons/surah/101-al-qariah.svg",
  adiyat: "./icons/surah/100-al-adiyat.svg",
  zalzalah: "./icons/surah/099-az-zalzalah.svg",
  bayyinah: "./icons/surah/098-al-bayyinah.svg",
  qadr: "./icons/surah/097-al-qadr.svg",
  alaq: "./icons/surah/096-al-alaq.svg",
  tin: "./icons/surah/095-at-tin.svg",
  syarh: "./icons/surah/094-asy-syarh.svg",
  dhuha: "./icons/surah/093-adh-dhuha.svg",
  lail: "./icons/surah/092-al-lail.svg",
  syams: "./icons/surah/091-asy-syams.svg",
  balad: "./icons/surah/090-al-balad.svg",
  fajr: "./icons/surah/089-al-fajr.svg",
  ghasyiyah: "./icons/surah/088-al-ghasyiyah.svg",
  ala: "./icons/surah/087-al-ala.svg",
  thariq: "./icons/surah/086-ath-thariq.svg",
  buruj: "./icons/surah/085-al-buruj.svg",
  insyiqaq: "./icons/surah/084-al-insyiqaq.svg",
  muthaffifin: "./icons/surah/083-al-muthaffifin.svg",
  infithar: "./icons/surah/082-al-infithar.svg",
  takwir: "./icons/surah/081-at-takwir.svg",
  abasa: "./icons/surah/080-abasa.svg",
  naziat: "./icons/surah/079-an-naziat.svg",
  naba: "./icons/surah/078-an-naba.svg",
});

/*
 * Muat 37 SVG individual lalu salin bentuknya ke sprite lokal.
 * app.js tetap memakai #s-<sym>, jadi tidak perlu perubahan pada renderer.
 * Karena simbol hasil salinan berada di dokumen utama, currentColor tetap
 * mengikuti warna card/hero secara konsisten, termasuk Safari/iOS.
 */
async function installSurahIcons() {
  if (typeof document === 'undefined') return;
  const sprite = document.getElementById('sprite');
  const defs = sprite && sprite.querySelector('defs');
  if (!defs || defs.querySelector('#s-naba')) return;

  const symbols = await Promise.all(Object.entries(SURAH_ICON_FILES).map(async ([sym, path]) => {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
      const source = doc.querySelector('symbol#icon');
      if (!source) throw new Error('symbol#icon tidak ditemukan');
      return `<symbol id="s-${sym}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${source.innerHTML}</symbol>`;
    } catch (error) {
      console.warn(`[HafizKu icon] gagal memuat ${path}`, error);
      return `<symbol id="s-${sym}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/></symbol>`;
    }
  }));

  defs.insertAdjacentHTML('beforeend', symbols.join(''));
}
installSurahIcons();

/* Level dikelompokkan dari jumlah ayat. */
const LEVELS = [
  { key: "1", label: "Level 1",  hint: "3–6 ayat",   test: s => s.n <= 6 },
  { key: "2", label: "Level 2",  hint: "7–15 ayat",  test: s => s.n >= 7  && s.n <= 15 },
  { key: "3", label: "Level 3",  hint: "16–30 ayat", test: s => s.n >= 16 && s.n <= 30 },
  { key: "4", label: "Level 4",  hint: "31+ ayat",   test: s => s.n >= 31 },
  { key: "all", label: "Semua",  hint: "37 surah",   test: () => true }
];

const RECITERS = [
  { id: "ar.husary_muallim",     name: "Al-Husary Mu’allim", note: "untuk anak — pelan, jelas, mudah ditirukan" },
  { id: "ar.husary",             name: "Syekh Al-Husary",   note: "pelan, jelas — paling enak untuk menirukan" },
  { id: "ar.alafasy",            name: "Syekh Al-Afasy",    note: "merdu, tempo sedang" },
  { id: "ar.minshawi",           name: "Syekh Al-Minsyawi", note: "lembut" },
  { id: "ar.abdulbasitmurattal", name: "Syekh Abdul Basith",note: "murattal klasik" }
];

const APP_VERSION = '10.2.0';
const AUDIO_CACHE_NAME = 'hafiz-audio-v2';

const AUDIO_CONFIG = Object.freeze({
  everyayah: Object.freeze({
    host: 'everyayah.com',
    basePath: '/data',
    folders: Object.freeze({
      'ar.husary_muallim': 'Husary_Muallim_128kbps',
      'ar.husary': 'Husary_128kbps',
      'ar.alafasy': 'Alafasy_128kbps',
      'ar.minshawi': 'Minshawy_Murattal_128kbps',
      'ar.abdulbasitmurattal': 'Abdul_Basit_Murattal_192kbps'
    })
  }),
  quranProject: Object.freeze({
    host: 'the-quran-project.github.io',
    basePath: '/Quran-Audio/Data/1'
  }),
  quranFoundation: Object.freeze({
    host: 'verses.quran.foundation',
    basePath: '/Alafasy/mp3'
  })
});

const AUDIO_HOSTS = Object.freeze(
  [...new Set(Object.values(AUDIO_CONFIG).map(source => source.host))]
);
