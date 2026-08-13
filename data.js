/* Hafizku — data Juz 30 (surah 78–114)
 *
 * "start" = nomor ayat global (1..6236). Dipakai untuk menyusun URL audio
 * tanpa perlu memanggil API sama sekali, jadi daftar ayat langsung muncul
 * walau sedang offline.
 *
 * Diverifikasi dengan 3 titik acuan:
 *   total ayat Al-Qur'an       = 6236
 *   ayat pertama An-Naba'      = 5673
 *   An-Nas                     = 6231..6236
 *
 * "sym"   = nama simbol di sprite SVG (lihat #sprite di index.html)
 * "sky"   = keluarga warna pada ramp waktu (dawn/sun/sky/garden/dusk/night)
 */
const SURAHS = [
  { id: 114, name: "An-Nas",        ar: "الناس",     meaning: "Manusia",              start: 6231, n: 6,  sym: "people",   sky: "sky" },
  { id: 113, name: "Al-Falaq",      ar: "الفلق",     meaning: "Waktu Subuh",          start: 6226, n: 5,  sym: "sunrise",  sky: "dawn" },
  { id: 112, name: "Al-Ikhlas",     ar: "الإخلاص",   meaning: "Memurnikan Iman",      start: 6222, n: 4,  sym: "heart",    sky: "sun" },
  { id: 111, name: "Al-Masad",      ar: "المسد",     meaning: "Sabut Kurma",          start: 6217, n: 5,  sym: "palm",     sky: "garden" },
  { id: 110, name: "An-Nasr",       ar: "النصر",     meaning: "Pertolongan",          start: 6214, n: 3,  sym: "hands",    sky: "dawn" },
  { id: 109, name: "Al-Kafirun",    ar: "الكافرون",  meaning: "Orang Kafir",          start: 6208, n: 6,  sym: "people",   sky: "dusk" },
  { id: 108, name: "Al-Kautsar",    ar: "الكوثر",    meaning: "Nikmat yang Banyak",   start: 6205, n: 3,  sym: "cloud",    sky: "sky" },
  { id: 107, name: "Al-Ma'un",      ar: "الماعون",   meaning: "Barang Berguna",       start: 6198, n: 7,  sym: "hands",    sky: "garden" },
  { id: 106, name: "Quraisy",       ar: "قريش",      meaning: "Suku Quraisy",         start: 6194, n: 4,  sym: "camel",    sky: "sun" },
  { id: 105, name: "Al-Fil",        ar: "الفيل",     meaning: "Gajah",                start: 6189, n: 5,  sym: "elephant", sky: "dusk" },
  { id: 104, name: "Al-Humazah",    ar: "الهمزة",    meaning: "Pengumpat",            start: 6180, n: 9,  sym: "people",   sky: "dusk" },
  { id: 103, name: "Al-'Asr",       ar: "العصر",     meaning: "Waktu Asar",           start: 6177, n: 3,  sym: "sun",      sky: "sun" },
  { id: 102, name: "At-Takatsur",   ar: "التكاثر",   meaning: "Bermegah-megahan",     start: 6169, n: 8,  sym: "scale",    sky: "dusk" },
  { id: 101, name: "Al-Qari'ah",    ar: "القارعة",   meaning: "Hari Kiamat",          start: 6158, n: 11, sym: "quake",    sky: "night" },
  { id: 100, name: "Al-'Adiyat",    ar: "العاديات",  meaning: "Kuda Perang",          start: 6147, n: 11, sym: "horse",    sky: "dawn" },
  { id: 99,  name: "Az-Zalzalah",   ar: "الزلزلة",   meaning: "Kegoncangan",          start: 6139, n: 8,  sym: "quake",    sky: "garden" },
  { id: 98,  name: "Al-Bayyinah",   ar: "البينة",    meaning: "Bukti Nyata",          start: 6131, n: 8,  sym: "book",     sky: "sky" },
  { id: 97,  name: "Al-Qadr",       ar: "القدر",     meaning: "Malam Kemuliaan",      start: 6126, n: 5,  sym: "stars",     sky: "night" },
  { id: 96,  name: "Al-'Alaq",      ar: "العلق",     meaning: "Segumpal Darah",       start: 6107, n: 19, sym: "book",     sky: "sky" },
  { id: 95,  name: "At-Tin",        ar: "التين",     meaning: "Buah Tin",             start: 6099, n: 8,  sym: "sun",     sky: "garden" },
  { id: 94,  name: "Asy-Syarh",     ar: "الشرح",     meaning: "Kelapangan Hati",      start: 6091, n: 8,  sym: "heart",    sky: "dawn" },
  { id: 93,  name: "Adh-Dhuha",     ar: "الضحى",     meaning: "Waktu Duha",           start: 6080, n: 11, sym: "sunrise",  sky: "sun" },
  { id: 92,  name: "Al-Lail",       ar: "الليل",     meaning: "Malam",                start: 6059, n: 21, sym: "moon",     sky: "night" },
  { id: 91,  name: "Asy-Syams",     ar: "الشمس",     meaning: "Matahari",             start: 6044, n: 15, sym: "sun",      sky: "sun" },
  { id: 90,  name: "Al-Balad",      ar: "البلد",     meaning: "Negeri",               start: 6024, n: 20, sym: "city",     sky: "dusk" },
  { id: 89,  name: "Al-Fajr",       ar: "الفجر",     meaning: "Waktu Fajar",          start: 5994, n: 30, sym: "sunrise",  sky: "dawn" },
  { id: 88,  name: "Al-Ghasyiyah",  ar: "الغاشية",   meaning: "Hari Pembalasan",      start: 5968, n: 26, sym: "cloud",    sky: "night" },
  { id: 87,  name: "Al-A'la",       ar: "الأعلى",    meaning: "Yang Maha Tinggi",     start: 5949, n: 19, sym: "sun",    sky: "sky" },
  { id: 86,  name: "Ath-Thariq",    ar: "الطارق",    meaning: "Bintang Malam",        start: 5932, n: 17, sym: "stars",    sky: "night" },
  { id: 85,  name: "Al-Buruj",      ar: "البروج",    meaning: "Gugusan Bintang",      start: 5910, n: 22, sym: "stars",    sky: "night" },
  { id: 84,  name: "Al-Insyiqaq",   ar: "الانشقاق",  meaning: "Terbelah",             start: 5885, n: 25, sym: "cloud",    sky: "dusk" },
  { id: 83,  name: "Al-Muthaffifin",ar: "المطففين",  meaning: "Orang Curang",         start: 5849, n: 36, sym: "scale",    sky: "garden" },
  { id: 82,  name: "Al-Infithar",   ar: "الانفطار",  meaning: "Langit Terbelah",      start: 5830, n: 19, sym: "cloud",    sky: "dusk" },
  { id: 81,  name: "At-Takwir",     ar: "التكوير",   meaning: "Menggulung",           start: 5801, n: 29, sym: "sun",     sky: "dusk" },
  { id: 80,  name: "'Abasa",        ar: "عبس",       meaning: "Bermuka Masam",        start: 5759, n: 42, sym: "people",   sky: "sky" },
  { id: 79,  name: "An-Nazi'at",    ar: "النازعات",  meaning: "Malaikat Pencabut",    start: 5713, n: 46, sym: "stars",     sky: "night" },
  { id: 78,  name: "An-Naba'",      ar: "النبأ",     meaning: "Berita Besar",         start: 5673, n: 40, sym: "book",     sky: "sky" }
];

/* Level dikelompokkan dari jumlah ayat: pengelompokan yang benar-benar
 * berarti untuk anak yang sedang menghafal, bukan tanda "favorit". */
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


/* Konfigurasi runtime tunggal. Service worker memuat file ini juga lewat
 * importScripts('./data.js'), jadi host audio dan versi cache tidak pernah
 * didefinisikan ganda. */
const APP_VERSION = '10.1.0';
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
