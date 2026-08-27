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
 * "sym" = simbol unik surat di sprite SVG Juz 30 di bawah.
 * "sky" = keluarga warna card: dawn/sun/sky/garden/dusk/night.
 *
 * Ikon dibuat sederhana, homogen, satu warna (currentColor), dan mengikuti
 * warna card. Paket v2 mengikuti langsung concept board Juz 30 yang disetujui.
 */
const SURAHS = [
  { id: 114, name: "An-Nas",        ar: "الناس",     meaning: "Manusia",              start: 6231, n: 6,  sym: "nas",        sky: "sky" },
  { id: 113, name: "Al-Falaq",      ar: "الفلق",     meaning: "Waktu Subuh",          start: 6226, n: 5,  sym: "falaq",      sky: "dawn" },
  { id: 112, name: "Al-Ikhlas",     ar: "الإخلاص",   meaning: "Memurnikan Iman",      start: 6222, n: 4,  sym: "ikhlas",     sky: "sun" },
  { id: 111, name: "Al-Masad",      ar: "المسد",     meaning: "Sabut Kurma",          start: 6217, n: 5,  sym: "masad",      sky: "dusk" },
  { id: 110, name: "An-Nasr",       ar: "النصر",     meaning: "Pertolongan",          start: 6214, n: 3,  sym: "nasr",       sky: "dawn" },
  { id: 109, name: "Al-Kafirun",    ar: "الكافرون",  meaning: "Orang Kafir",          start: 6208, n: 6,  sym: "kafirun",    sky: "dusk" },
  { id: 108, name: "Al-Kautsar",    ar: "الكوثر",    meaning: "Nikmat yang Banyak",   start: 6205, n: 3,  sym: "kautsar",    sky: "sky" },
  { id: 107, name: "Al-Ma'un",      ar: "الماعون",   meaning: "Barang Berguna",       start: 6198, n: 7,  sym: "maun",       sky: "garden" },
  { id: 106, name: "Quraisy",       ar: "قريش",      meaning: "Suku Quraisy",         start: 6194, n: 4,  sym: "quraisy",    sky: "sun" },
  { id: 105, name: "Al-Fil",        ar: "الفيل",     meaning: "Gajah",                start: 6189, n: 5,  sym: "fil",        sky: "dusk" },
  { id: 104, name: "Al-Humazah",    ar: "الهمزة",    meaning: "Pengumpat",            start: 6180, n: 9,  sym: "humazah",    sky: "dusk" },
  { id: 103, name: "Al-'Asr",       ar: "العصر",     meaning: "Waktu Asar",           start: 6177, n: 3,  sym: "asr",        sky: "sun" },
  { id: 102, name: "At-Takatsur",   ar: "التكاثر",   meaning: "Bermegah-megahan",     start: 6169, n: 8,  sym: "takatsur",   sky: "dusk" },
  { id: 101, name: "Al-Qari'ah",    ar: "القارعة",   meaning: "Hari Kiamat",          start: 6158, n: 11, sym: "qariah",     sky: "night" },
  { id: 100, name: "Al-'Adiyat",    ar: "العاديات",  meaning: "Kuda Perang",          start: 6147, n: 11, sym: "adiyat",     sky: "dawn" },
  { id: 99,  name: "Az-Zalzalah",   ar: "الزلزلة",   meaning: "Kegoncangan",          start: 6139, n: 8,  sym: "zalzalah",   sky: "dusk" },
  { id: 98,  name: "Al-Bayyinah",   ar: "البينة",    meaning: "Bukti Nyata",          start: 6131, n: 8,  sym: "bayyinah",   sky: "sky" },
  { id: 97,  name: "Al-Qadr",       ar: "القدر",     meaning: "Malam Kemuliaan",      start: 6126, n: 5,  sym: "qadr",       sky: "night" },
  { id: 96,  name: "Al-'Alaq",      ar: "العلق",     meaning: "Segumpal Darah",       start: 6107, n: 19, sym: "alaq",       sky: "sky" },
  { id: 95,  name: "At-Tin",        ar: "التين",     meaning: "Buah Tin",             start: 6099, n: 8,  sym: "tin",        sky: "garden" },
  { id: 94,  name: "Asy-Syarh",     ar: "الشرح",     meaning: "Kelapangan Hati",      start: 6091, n: 8,  sym: "syarh",      sky: "sky" },
  { id: 93,  name: "Adh-Dhuha",     ar: "الضحى",     meaning: "Waktu Duha",           start: 6080, n: 11, sym: "dhuha",      sky: "sun" },
  { id: 92,  name: "Al-Lail",       ar: "الليل",     meaning: "Malam",                start: 6059, n: 21, sym: "lail",       sky: "night" },
  { id: 91,  name: "Asy-Syams",     ar: "الشمس",     meaning: "Matahari",             start: 6044, n: 15, sym: "syams",      sky: "sun" },
  { id: 90,  name: "Al-Balad",      ar: "البلد",     meaning: "Negeri",               start: 6024, n: 20, sym: "balad",      sky: "dusk" },
  { id: 89,  name: "Al-Fajr",       ar: "الفجر",     meaning: "Waktu Fajar",          start: 5994, n: 30, sym: "fajr",       sky: "dawn" },
  { id: 88,  name: "Al-Ghasyiyah",  ar: "الغاشية",   meaning: "Hari Pembalasan",      start: 5968, n: 26, sym: "ghasyiyah",  sky: "night" },
  { id: 87,  name: "Al-A'la",       ar: "الأعلى",    meaning: "Yang Maha Tinggi",     start: 5949, n: 19, sym: "ala",        sky: "sky" },
  { id: 86,  name: "Ath-Thariq",    ar: "الطارق",    meaning: "Bintang Malam",        start: 5932, n: 17, sym: "thariq",     sky: "night" },
  { id: 85,  name: "Al-Buruj",      ar: "البروج",    meaning: "Gugusan Bintang",      start: 5910, n: 22, sym: "buruj",      sky: "night" },
  { id: 84,  name: "Al-Insyiqaq",   ar: "الانشقاق",  meaning: "Terbelah",             start: 5885, n: 25, sym: "insyiqaq",   sky: "dusk" },
  { id: 83,  name: "Al-Muthaffifin",ar: "المطففين",  meaning: "Orang Curang",         start: 5849, n: 36, sym: "muthaffifin",sky: "dusk" },
  { id: 82,  name: "Al-Infithar",   ar: "الانفطار",  meaning: "Langit Terbelah",      start: 5830, n: 19, sym: "infithar",   sky: "dusk" },
  { id: 81,  name: "At-Takwir",     ar: "التكوير",   meaning: "Menggulung",           start: 5801, n: 29, sym: "takwir",     sky: "dusk" },
  { id: 80,  name: "'Abasa",        ar: "عبس",       meaning: "Bermuka Masam",        start: 5759, n: 42, sym: "abasa",      sky: "garden" },
  { id: 79,  name: "An-Nazi'at",    ar: "النازعات",  meaning: "Malaikat Pencabut",    start: 5713, n: 46, sym: "naziat",     sky: "night" },
  { id: 78,  name: "An-Naba'",      ar: "النبأ",     meaning: "Berita Besar",         start: 5673, n: 40, sym: "naba",       sky: "sky" }
];

/* Concept-board matched SVG set. Bentuk sengaja sederhana dan berukuran 24x24;
 * stroke/warna diwarisi dari card melalui currentColor. */
const SURAH_ICON_SPRITE = `
<symbol id="s-naba" viewBox="0 0 24 24"><path d="M3.8 8.2c3-.5 5.7.1 8.2 1.8 2.5-1.7 5.2-2.3 8.2-1.8v9.5c-3-.4-5.7.2-8.2 1.8-2.5-1.6-5.2-2.2-8.2-1.8z"/><path d="M12 10v9.5M12 2.7v3M6.7 4.2l1.6 2M17.3 4.2l-1.6 2M3.6 6.4l2.1 1"/></symbol>
<symbol id="s-naziat" viewBox="0 0 24 24"><path d="M3.2 18.8C7 13.8 11.3 10.1 17.8 7M4 21c4.5-4.4 9.2-7.3 15.8-9.2M3.2 14.6c3.2-4.2 6.8-7.1 11.3-9"/><path d="m19 2.8.9 2 2.2.3-1.6 1.5.4 2.2L19 7.8l-1.9 1 .4-2.2-1.6-1.5 2.2-.3z"/></symbol>
<symbol id="s-abasa" viewBox="0 0 24 24"><path d="M12 4.2c-3.7 2.4-5.2 5.7-4.4 9.8.7 3.5 2.8 5.6 4.4 6.2 1.6-.6 3.7-2.7 4.4-6.2.8-4.1-.7-7.4-4.4-9.8z"/><path d="M12 5.2v14M12 10c2.2-2.4 4.5-3.4 7-3.1-.2 3-1.7 5-4.6 6.2"/></symbol>
<symbol id="s-takwir" viewBox="0 0 24 24"><circle cx="10.5" cy="11" r="4"/><path d="M3.1 13.8c4.6 2.9 12.9 3.2 17.8-.7M17 5.8c2.8.8 4.4 2.3 4.6 4.6M11 2.5v2.3M4.3 5.4l1.8 1.5"/></symbol>
<symbol id="s-infithar" viewBox="0 0 24 24"><path d="M3.5 18.8A8.5 8.5 0 0 1 20.5 18.8H3.5z"/><path d="m12.3 3.2-1.5 3.2 2 2-2.5 2.8 2.3 2.4-2 5.2"/></symbol>
<symbol id="s-muthaffifin" viewBox="0 0 24 24"><path d="M12 3.5v16.8M6.5 20.3h11M4 7.7h16"/><path d="M4 7.7 2.1 12a2.7 2.7 0 0 0 5.2 0zM20 7.7l1.9 4.3a2.7 2.7 0 0 1-5.2 0z"/><circle cx="12" cy="5" r="1"/></symbol>
<symbol id="s-insyiqaq" viewBox="0 0 24 24"><path d="M2.6 17.5c3.1-2.5 6.2-3.7 9.4-3.7s6.3 1.2 9.4 3.7"/><path d="m12 7.1-1.4 2.2 1.8 1.7-1.8 2.8M12 2.7v2.2M5.7 5l1.5 1.8M18.3 5l-1.5 1.8"/></symbol>
<symbol id="s-buruj" viewBox="0 0 24 24"><path d="m5 4.6.8 1.8 2 .3-1.5 1.4.4 2-1.7-1-1.7 1 .4-2-1.5-1.4 2-.3zM18 6l.8 1.8 2 .3-1.5 1.4.4 2-1.7-1-1.7 1 .4-2-1.5-1.4 2-.3zM11.8 10.4l.7 1.6 1.8.3-1.3 1.2.3 1.8-1.5-.9-1.6.9.3-1.8-1.3-1.2 1.8-.3zM5.2 15.4l.7 1.6 1.8.3-1.3 1.2.3 1.8-1.5-.9-1.6.9.3-1.8-1.3-1.2 1.8-.3zM18 15l.8 1.8 2 .3-1.5 1.4.4 2-1.7-1-1.7 1 .4-2-1.5-1.4 2-.3z"/><path d="M7.2 8.2 10.6 11M13.4 13.4l3 2.2M7.2 16.7l3.2-2.2"/></symbol>
<symbol id="s-thariq" viewBox="0 0 24 24"><path d="m12 4 1.7 4.3L18 10l-4.3 1.7L12 16l-1.7-4.3L6 10l4.3-1.7z"/><circle cx="4" cy="5" r=".7" fill="currentColor" stroke="none"/><circle cx="19.5" cy="5.8" r=".7" fill="currentColor" stroke="none"/><circle cx="4.5" cy="15.8" r=".7" fill="currentColor" stroke="none"/><circle cx="19.3" cy="17" r=".7" fill="currentColor" stroke="none"/><circle cx="8" cy="19" r=".7" fill="currentColor" stroke="none"/><circle cx="16" cy="20" r=".7" fill="currentColor" stroke="none"/></symbol>
<symbol id="s-ala" viewBox="0 0 24 24"><path d="M5 19h14M6.5 18.8v-4.2a5.5 5.5 0 0 1 11 0v4.2"/><path d="m12 3 .8 1.9 2 .3-1.5 1.4.4 2-1.7-.9-1.7.9.4-2-1.5-1.4 2-.3z"/></symbol>
<symbol id="s-ghasyiyah" viewBox="0 0 24 24"><path d="M3 14.5c2-5.6 5.1-8.4 9.2-8.4 3.2 0 5.5 1.7 6.8 5.2-2.1-.8-3.9-.3-5.2 1.3-1.8 2.2-3.6 2.8-5.6 1.7-1.9-1-3.6-.9-5.2.2z"/><path d="M3.2 18c2.6-1 5.2-1 7.8 0s5.2 1 7.8 0"/></symbol>
<symbol id="s-fajr" viewBox="0 0 24 24"><path d="M2.8 18.8h18.4M5.5 16a6.5 6.5 0 0 1 13 0"/><path d="M12 3v3M4.8 7.2l2.1 2M19.2 7.2l-2.1 2M2.8 12h3M18.2 12h3"/></symbol>
<symbol id="s-balad" viewBox="0 0 24 24"><path d="M2.8 20h18.4M4.5 20v-8.5h3.7V20M8.2 20V7.8h4V20M12.2 20v-5.5h3.3V20M15.5 20V5.5h4V20"/><path d="M9.5 10.5h1.4M9.5 13.5h1.4M16.8 8.5h1.4M16.8 11.5h1.4"/></symbol>
<symbol id="s-syams" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.3v2.6M12 19.1v2.6M2.3 12h2.6M19.1 12h2.6M5.1 5.1 7 7M17 17l1.9 1.9M18.9 5.1 17 7M7 17l-1.9 1.9"/></symbol>
<symbol id="s-lail" viewBox="0 0 24 24"><path d="M17.6 14.7A7.5 7.5 0 0 1 9 4.8a6.5 6.5 0 1 0 8.6 9.9z"/><path d="m18.9 4.7.5 1.1 1.2.2-.9.8.2 1.2-1-.6-1.1.6.2-1.2-.9-.8 1.3-.2zM19.4 10.8l.4.9 1 .2-.7.7.2 1-1-.5-.8.5.1-1-.7-.7 1-.2zM3.8 19c2.6-1.2 5.2-1.2 7.8 0"/></symbol>
<symbol id="s-dhuha" viewBox="0 0 24 24"><path d="M3 19h18M5.3 16.6a6.7 6.7 0 0 1 13.4 0"/><path d="M12 2.5v3.4M4.5 7.3l2.2 2M19.5 7.3l-2.2 2M2.7 12.3h3.2M18.1 12.3h3.2"/></symbol>
<symbol id="s-syarh" viewBox="0 0 24 24"><path d="M5.5 20V11.5a6.5 6.5 0 0 1 13 0V20M8 20v-8.2a4 4 0 0 1 8 0V20"/><path d="M4 20h16"/></symbol>
<symbol id="s-tin" viewBox="0 0 24 24"><path d="M3.8 16.9C5.1 9.8 9.5 5.8 16.5 5.1c-.6 6.9-4.5 11.4-11.7 12.7"/><path d="M5.6 16.2c2.5-2.9 5.3-5.4 8.6-7.7M17 9.6c2.3 1.4 3.5 3.3 3.5 5.7 0 2.8-1.7 4.8-4.2 4.8s-4.2-2-4.2-4.8c0-1.8.8-3.4 2.1-4.7M16.3 12.1v5.2"/></symbol>
<symbol id="s-alaq" viewBox="0 0 24 24"><path d="M3.5 8c3.1-.5 5.9.1 8.5 1.8 2.6-1.7 5.4-2.3 8.5-1.8v9.7c-3.1-.4-5.9.2-8.5 1.8-2.6-1.6-5.4-2.2-8.5-1.8z"/><path d="M12 9.8v9.7M15 14.8l4.8-8 1.7 1-4.7 7.9-2.5 1.5z"/></symbol>
<symbol id="s-qadr" viewBox="0 0 24 24"><path d="M16.7 15.4A7.3 7.3 0 0 1 8.8 5a6.4 6.4 0 1 0 7.9 10.4z"/><path d="m19 3.6.6 1.4 1.6.2-1.2 1 .3 1.6-1.3-.8-1.4.8.3-1.6-1.1-1 1.5-.2zM5.2 5.2l.5 1.1 1.2.2-.9.8.2 1.2-1-.6-1 .6.2-1.2-.9-.8 1.2-.2zM19.2 16.4l.4 1 .9.1-.7.7.2.9-.8-.4-.8.4.2-.9-.7-.7.9-.1z"/></symbol>
<symbol id="s-bayyinah" viewBox="0 0 24 24"><path d="M3.7 8.5c3-.5 5.8.1 8.3 1.8 2.5-1.7 5.3-2.3 8.3-1.8v9.4c-3-.4-5.8.2-8.3 1.8-2.5-1.6-5.3-2.2-8.3-1.8z"/><path d="M12 10.3v9.4M12 2.7v3M6.5 4.2l1.8 2M17.5 4.2l-1.8 2M3.5 6.2l2.3 1M20.5 6.2l-2.3 1"/></symbol>
<symbol id="s-zalzalah" viewBox="0 0 24 24"><path d="M2.7 16.7 6.2 14l3.4 1.5 2.4-4.5 2.5 4.6 3.3-1.4 3.5 2.5"/><path d="m12 4-1.5 3.1 2 1.9-2.2 2.4 1.7 1.8-1.5 3.3M3.5 19.2l3-1M17.5 18.2l3 1"/></symbol>
<symbol id="s-adiyat" viewBox="0 0 24 24"><path d="M2.8 7.2h8.8M2 11.8h10M3.8 16.4h7.4"/><path d="m17.2 4 .8 1.9 2 .3-1.5 1.4.4 2-1.7-.9-1.7.9.4-2-1.5-1.4 2-.3zM16 13.2l.6 1.4 1.5.2-1.1 1 .3 1.5-1.3-.7-1.3.7.3-1.5-1.1-1 1.5-.2zM20.1 17.3l.4.9 1 .1-.7.7.2 1-.9-.5-.8.5.2-1-.7-.7.9-.1z"/></symbol>
<symbol id="s-qariah" viewBox="0 0 24 24"><path d="m12 5.2 1.7 4.4 4.4 1.7-4.4 1.7-1.7 4.4-1.7-4.4-4.4-1.7 4.4-1.7z"/><path d="M12 2.3v2M12 18.7v3M2.8 11.3h2.1M19.1 11.3h2.1M5 4.3l1.5 1.6M17.5 16l1.8 1.8M19 4.5l-1.4 1.4M6.4 16.1 4.7 17.8"/></symbol>
<symbol id="s-takatsur" viewBox="0 0 24 24"><ellipse cx="7.2" cy="7" rx="3.6" ry="1.5"/><path d="M3.6 7v8c0 .9 1.6 1.5 3.6 1.5s3.6-.6 3.6-1.5V7M3.6 10c0 .9 1.6 1.5 3.6 1.5s3.6-.6 3.6-1.5M3.6 13c0 .9 1.6 1.5 3.6 1.5s3.6-.6 3.6-1.5"/><ellipse cx="15.6" cy="5.5" rx="3.6" ry="1.5"/><path d="M12 5.5v9c0 .9 1.6 1.5 3.6 1.5s3.6-.6 3.6-1.5v-9M12 8.5c0 .9 1.6 1.5 3.6 1.5s3.6-.6 3.6-1.5M12 11.5c0 .9 1.6 1.5 3.6 1.5s3.6-.6 3.6-1.5"/><ellipse cx="18.2" cy="18.3" rx="3.2" ry="1.4"/></symbol>
<symbol id="s-asr" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.2"/><path d="M12 6.5V12l3.7 2.2"/><circle cx="12" cy="12" r=".8" fill="currentColor" stroke="none"/></symbol>
<symbol id="s-humazah" viewBox="0 0 24 24"><path d="M3.5 5.5h17v11H12l-4.8 3.2v-3.2H3.5z"/><path d="m12.2 7.3-1.5 2.3 1.9 1.8-1.7 2.5 1.5 2.1"/></symbol>
<symbol id="s-fil" viewBox="0 0 24 24"><path d="M3 19.5V12h5v3.2h2.5v4.3M21 19.5V12h-5v3.2h-2.5v4.3M8 19.5h8"/><path d="M6.5 5.2v2.2M12 3.5v2.5M17.5 5.2v2.2"/><path d="m6.5 7.4-.9 1.4 1.6.3.8 1.3.8-1.3 1.6-.3-.9-1.4M12 6l-.9 1.5 1.7.3.8 1.4.8-1.4 1.7-.3-.9-1.5M17.5 7.4l-.9 1.4 1.6.3.8 1.3.8-1.3 1.6-.3-.9-1.4"/></symbol>
<symbol id="s-quraisy" viewBox="0 0 24 24"><path d="M6.2 6.7c0 2.7-3.1 5-3.1 5S0 9.4 0 6.7a3.1 3.1 0 0 1 6.2 0z" transform="translate(2 0)"/><circle cx="5.1" cy="6.7" r=".9"/><path d="M7.8 17.5c2.4-2.8 4.8-3.8 7.2-3 1.5.5 2.8.2 3.8-.9" stroke-dasharray="2 2"/><path d="M22 6.7c0 2.7-3.1 5-3.1 5s-3.1-2.3-3.1-5a3.1 3.1 0 0 1 6.2 0z"/><circle cx="18.9" cy="6.7" r=".9"/></symbol>
<symbol id="s-maun" viewBox="0 0 24 24"><path d="M4 12h16c-.6 4.8-3.2 7.2-8 7.2S4.6 16.8 4 12z"/><path d="M7.2 12c.5-1.4 1.7-2.2 3.4-2.2M12 8.2S8.8 6.3 8.8 4.1A2.2 2.2 0 0 1 12 2.3a2.2 2.2 0 0 1 3.2 1.8C15.2 6.3 12 8.2 12 8.2z"/></symbol>
<symbol id="s-kautsar" viewBox="0 0 24 24"><ellipse cx="12" cy="19" rx="7.7" ry="2"/><path d="M12 18V7M12 8.5c-1.4-2.2-3-3.2-4.7-2.8.1 3 1.7 5.2 4.7 6.6M12 8.5c1.4-2.2 3-3.2 4.7-2.8-.1 3-1.7 5.2-4.7 6.6M12 7c0-2-1-3.3-2.5-4M12 7c0-2 1-3.3 2.5-4"/></symbol>
<symbol id="s-kafirun" viewBox="0 0 24 24"><path d="M12 20.5v-5.2c0-3.9-2.5-7.2-8.3-9.8M12 20.5v-5.2c0-3.9 2.5-7.2 8.3-9.8"/><path d="M12 20.5v-2.2" stroke-dasharray="1.2 1.4"/></symbol>
<symbol id="s-nasr" viewBox="0 0 24 24"><path d="M4 20V7.5h16V20M7.5 20v-5a4.5 4.5 0 0 1 9 0v5"/><circle cx="4" cy="6" r="1"/><circle cx="20" cy="6" r="1"/><path d="m12 9 .7 1.6 1.8.3-1.3 1.2.3 1.8-1.5-.8-1.5.8.3-1.8-1.3-1.2 1.8-.3z"/></symbol>
<symbol id="s-masad" viewBox="0 0 24 24"><ellipse cx="10.5" cy="11.5" rx="6.8" ry="4.2"/><ellipse cx="10.5" cy="11.5" rx="4.7" ry="2.5"/><path d="M5.2 9c3.5 1.8 7.1 1.8 10.6 0M5.2 14c3.5-1.8 7.1-1.8 10.6 0M16.7 13.8c2.4.3 3.8 1.4 4.3 3.2M18.5 17c.3 1.7-.2 2.9-1.5 3.7"/></symbol>
<symbol id="s-ikhlas" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5.1"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><path d="M12 2.2v3M12 18.8v3M2.2 12h3M18.8 12h3M5.1 5.1l2.1 2.1M16.8 16.8l2.1 2.1M18.9 5.1l-2.1 2.1M7.2 16.8l-2.1 2.1"/></symbol>
<symbol id="s-falaq" viewBox="0 0 24 24"><path d="M2.7 19h18.6M5.2 16.6a6.8 6.8 0 0 1 13.6 0"/><path d="M12 2.5v3.2M4.5 7l2.2 2.1M19.5 7l-2.2 2.1M2.8 12h3.2M18 12h3.2"/></symbol>
<symbol id="s-nas" viewBox="0 0 24 24"><circle cx="12" cy="6.7" r="2.7"/><path d="M7 20a5 5 0 0 1 10 0"/><circle cx="5.2" cy="9" r="2"/><path d="M1.8 19a3.7 3.7 0 0 1 5.2-3.4"/><circle cx="18.8" cy="9" r="2"/><path d="M22.2 19a3.7 3.7 0 0 0-5.2-3.4"/></symbol>`;

function installSurahIcons() {
  if (typeof document === 'undefined') return;
  const sprite = document.getElementById('sprite');
  const defs = sprite && sprite.querySelector('defs');
  if (!defs || defs.querySelector('#s-naba')) return;
  defs.insertAdjacentHTML('beforeend', SURAH_ICON_SPRITE);
}
installSurahIcons();

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
