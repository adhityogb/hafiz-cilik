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
 * warna card. Figur manusia hanya dipakai untuk An-Nas, tanpa detail wajah.
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

/* 37 ikon unik Juz 30. Disisipkan ke sprite SVG yang sudah ada di index.html.
 * Semua bentuk memakai stroke/fill currentColor dari card, sehingga tidak
 * memiliki warna hard-coded dan otomatis serasi dengan enam palette HafizKu. */
const SURAH_ICON_SPRITE = `
<symbol id="s-naba" viewBox="0 0 24 24"><path d="M4 7.2c3.2-.5 5.8.2 8 1.8 2.2-1.6 4.8-2.3 8-1.8v10.4c-3.2-.4-5.8.2-8 1.8-2.2-1.6-4.8-2.2-8-1.8z"/><path d="M12 9v10.4M12 3v2.2M6.8 4.5l1.3 1.5M17.2 4.5 15.9 6"/></symbol>
<symbol id="s-naziat" viewBox="0 0 24 24"><path d="M3.5 18.5c3.1-5.4 7-9.1 13.3-11.3M5 20c3.8-4.1 7.9-6.9 14.2-8.3M4.2 14.7c2.7-4.4 5.8-7.2 10.2-9"/><path d="m18.7 3.4.8 1.8 1.9.3-1.4 1.3.3 1.9-1.6-.9-1.7.9.4-1.9-1.4-1.3 1.9-.3z"/></symbol>
<symbol id="s-abasa" viewBox="0 0 24 24"><path d="M12 20V10.2M12 13.4C8.9 13.1 6.7 11 6.4 8c3.1-.3 5.3 1.5 5.6 5.4zM12 15c3.5-.2 5.8-2.3 6.1-5.5-3.4-.2-5.8 1.7-6.1 5.5z"/><path d="M8 20h8M12 6.2c1.3-1 2-2.1 2-3.2"/></symbol>
<symbol id="s-takwir" viewBox="0 0 24 24"><circle cx="10.5" cy="11" r="4.2"/><path d="M3.2 13.8c4.4 2.9 13 3.1 17.3-.9M18.2 6.5c2 1.5 2.8 3.3 2.3 5.1M12 2.8v2.1M4.8 5.1l1.5 1.5"/></symbol>
<symbol id="s-infithar" viewBox="0 0 24 24"><path d="M3.2 19a8.8 8.8 0 0 1 17.6 0"/><path d="m12 3.2-1.5 4.1 2.1 2.1-2.5 3 2.2 2.4-1.1 4.2"/></symbol>
<symbol id="s-muthaffifin" viewBox="0 0 24 24"><path d="M12 4v15.5M6.5 19.5h11M4 8h16"/><path d="M4 8 2.2 12.4a2.7 2.7 0 0 0 5.2 0zM20 8l1.8 4.4a2.7 2.7 0 0 1-5.2 0z"/><circle cx="12" cy="5" r="1"/></symbol>
<symbol id="s-insyiqaq" viewBox="0 0 24 24"><path d="M2.7 17.5c3.2-4 6.1-5.8 9.3-5.8s6.1 1.8 9.3 5.8"/><path d="m12 3.2-1.2 3 1.8 1.8-2.2 2.4 1.6 1.3M3.5 20h17"/></symbol>
<symbol id="s-buruj" viewBox="0 0 24 24"><path d="M5 6.2 9.3 9l4.1-4 5.1 3.2M9.3 9l3.2 5.8 5.4 2.3M12.5 14.8 6.8 18" stroke-dasharray="1.8 2.1"/><circle cx="5" cy="6.2" r="1.3"/><circle cx="13.4" cy="5" r="1.3"/><circle cx="18.5" cy="8.2" r="1.3"/><circle cx="9.3" cy="9" r="1.3"/><circle cx="12.5" cy="14.8" r="1.3"/><circle cx="17.9" cy="17.1" r="1.3"/><circle cx="6.8" cy="18" r="1.3"/></symbol>
<symbol id="s-thariq" viewBox="0 0 24 24"><path d="m12 4 1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z"/><circle cx="4.5" cy="5.2" r=".8" fill="currentColor" stroke="none"/><circle cx="19.5" cy="6.3" r=".8" fill="currentColor" stroke="none"/><circle cx="5.2" cy="17.8" r=".8" fill="currentColor" stroke="none"/><circle cx="19" cy="18.2" r=".8" fill="currentColor" stroke="none"/></symbol>
<symbol id="s-ala" viewBox="0 0 24 24"><path d="M4.2 19h15.6L12 8.2zM8.2 19l3.8-5.2 3.8 5.2"/><path d="m12 2.8.9 2 2.2.3-1.6 1.5.4 2.2-1.9-1-1.9 1 .4-2.2-1.6-1.5 2.2-.3z"/></symbol>
<symbol id="s-ghasyiyah" viewBox="0 0 24 24"><path d="M3 15c2.2-6.3 6-9.4 10.3-9.4 4 0 6.5 2.2 7.7 6.6-2.8-1.8-5.1-1.9-7.1-.2-2.1 1.8-3.9 2-5.8.7C6.2 11.5 4.5 12.2 3 15z"/><path d="M4 18.4h16"/></symbol>
<symbol id="s-fajr" viewBox="0 0 24 24"><path d="M3 18h18M6 15.5a6 6 0 0 1 12 0"/><path d="M12 3v3M4.8 7.2l2 2M19.2 7.2l-2 2M3.2 12h2.6M18.2 12h2.6"/></symbol>
<symbol id="s-balad" viewBox="0 0 24 24"><path d="M3 20.2h18M5 20.2v-8.4h4v8.4M10 20.2V8.2h4.4v12M15.5 20.2V11h3.5v9.2"/><path d="M11.2 11h2M11.2 14h2M6.2 14.5h1.6M16.4 13.7h1.2"/></symbol>
<symbol id="s-syams" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.3v2.6M12 19.1v2.6M2.3 12h2.6M19.1 12h2.6M5.1 5.1 7 7M17 17l1.9 1.9M18.9 5.1 17 7M7 17l-1.9 1.9"/></symbol>
<symbol id="s-lail" viewBox="0 0 24 24"><path d="M18.7 14.8A7.7 7.7 0 0 1 9.2 4.6a6.8 6.8 0 1 0 9.5 10.2z"/><path d="m18.8 5 .5 1.2 1.3.2-1 .9.3 1.3-1.1-.6-1.1.6.2-1.3-.9-.9 1.3-.2z"/></symbol>
<symbol id="s-dhuha" viewBox="0 0 24 24"><path d="M2.8 19h18.4M5.3 16.5a6.7 6.7 0 0 1 13.4 0"/><path d="M12 2.4v3.1M4.2 7l2.2 2.1M19.8 7l-2.2 2.1M2.7 12h3.1M18.2 12h3.1"/></symbol>
<symbol id="s-syarh" viewBox="0 0 24 24"><path d="M5 20V11.8a7 7 0 0 1 14 0V20M8.2 20v-8a3.8 3.8 0 0 1 7.6 0v8"/><path d="M12 2.7v2.4M3.8 7.2l2 1M20.2 7.2l-2 1"/></symbol>
<symbol id="s-tin" viewBox="0 0 24 24"><path d="M4.2 16.8C5.5 9.7 10 5.8 16.7 5.1c-.6 6.8-4.5 11.2-11.6 12.5"/><path d="M6.2 15.8c2.5-2.8 5.1-5.1 8.3-7.1M16.7 9.2c2.5 1.4 3.8 3.3 3.8 5.8 0 2.7-1.7 4.8-4.1 4.8s-4.1-2.1-4.1-4.8c0-1.7.8-3.3 2.1-4.6"/></symbol>
<symbol id="s-alaq" viewBox="0 0 24 24"><path d="M3.5 7.3c3.3-.5 6 .1 8.5 1.8 2.5-1.7 5.2-2.3 8.5-1.8v10.1c-3.3-.4-6 .2-8.5 1.8-2.5-1.6-5.2-2.2-8.5-1.8z"/><path d="M12 9v10.2M15.4 14.5l4.7-7.6 1.7 1-4.7 7.6-2.3 1.6z"/></symbol>
<symbol id="s-qadr" viewBox="0 0 24 24"><path d="M16.8 15.4A7.5 7.5 0 0 1 8.9 5a6.5 6.5 0 1 0 7.9 10.4z"/><path d="m18.7 4.1.6 1.4 1.5.2-1.1 1 .3 1.5-1.3-.7-1.3.7.3-1.5-1.1-1 1.5-.2z"/><circle cx="5" cy="6" r=".8" fill="currentColor" stroke="none"/><circle cx="19" cy="17.8" r=".8" fill="currentColor" stroke="none"/></symbol>
<symbol id="s-bayyinah" viewBox="0 0 24 24"><path d="M4 8c3.1-.5 5.8.1 8 1.8 2.2-1.7 4.9-2.3 8-1.8v10c-3.1-.4-5.8.2-8 1.8-2.2-1.6-4.9-2.2-8-1.8z"/><path d="M12 10v9.8M12 3v2.2M6.2 4.8 8 6.3M17.8 4.8 16 6.3M3.5 5.5l1.7.8M20.5 5.5l-1.7.8"/></symbol>
<symbol id="s-zalzalah" viewBox="0 0 24 24"><path d="M2.5 17.5 6.6 15l3 1.2 2.4-5.8 2 5 3.1-1.2 4.4 3.3"/><path d="m12 4-1.5 3.2 2 2-2.3 2.5 1.8 2.1-1.2 3.1"/></symbol>
<symbol id="s-adiyat" viewBox="0 0 24 24"><path d="M3 8h8M2 12h11M4 16h7"/><path d="m17 5 .8 1.9 2 .3-1.5 1.4.4 2-1.7-.9-1.8.9.4-2-1.5-1.4 2-.3zM16 14l.6 1.4 1.5.2-1.1 1 .3 1.5-1.3-.7-1.3.7.3-1.5-1.1-1 1.5-.2z"/></symbol>
<symbol id="s-qariah" viewBox="0 0 24 24"><path d="m12 5 1.8 5.2L19 12l-5.2 1.8L12 19l-1.8-5.2L5 12l5.2-1.8z"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></symbol>
<symbol id="s-takatsur" viewBox="0 0 24 24"><ellipse cx="8" cy="7" rx="4" ry="1.8"/><path d="M4 7v7c0 1 1.8 1.8 4 1.8s4-.8 4-1.8V7M4 10.5c0 1 1.8 1.8 4 1.8s4-.8 4-1.8"/><ellipse cx="16.5" cy="10.5" rx="3.5" ry="1.6"/><path d="M13 10.5v6c0 .9 1.6 1.6 3.5 1.6s3.5-.7 3.5-1.6v-6M13 13.5c0 .9 1.6 1.6 3.5 1.6s3.5-.7 3.5-1.6"/></symbol>
<symbol id="s-asr" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 6.7V12l3.8 2.3M12 3.5V2"/></symbol>
<symbol id="s-humazah" viewBox="0 0 24 24"><path d="M4 5.5h16v11H12l-4.6 3v-3H4z"/><path d="m12 7.3-1.4 2.2 1.8 1.7-1.6 2.6 1.5 2"/></symbol>
<symbol id="s-fil" viewBox="0 0 24 24"><path d="M3 19h6v-4H5v-4H3zM21 19h-6v-4h4v-4h2zM9 19l3-4 3 4"/><path d="M7 5.2 9 7.5M12 3.5v3M17 5.2l-2 2.3"/><circle cx="7" cy="5.2" r="1"/><circle cx="12" cy="3.5" r="1"/><circle cx="17" cy="5.2" r="1"/></symbol>
<symbol id="s-quraisy" viewBox="0 0 24 24"><path d="M5.2 7.2c0 2.7-3.2 4.5-3.2 4.5S-1.2 9.9-1.2 7.2a3.2 3.2 0 0 1 6.4 0z" transform="translate(3 0)"/><circle cx="5" cy="7.1" r="1"/><path d="M7.3 17.5c2.2-2.8 4.7-3.8 7.4-3.1 1.6.4 2.7.1 3.6-.8" stroke-dasharray="2 2"/><path d="M22 7.2c0 2.7-3.2 4.5-3.2 4.5s-3.2-1.8-3.2-4.5a3.2 3.2 0 0 1 6.4 0z"/><circle cx="18.8" cy="7.1" r="1"/></symbol>
<symbol id="s-maun" viewBox="0 0 24 24"><path d="M4 12h16c-.5 4.9-3.1 7.2-8 7.2S4.5 16.9 4 12z"/><path d="M7 12c.5-1.6 1.8-2.5 3.5-2.5M12 8.1s-3.2-1.9-3.2-4.1A2.2 2.2 0 0 1 12 2.2 2.2 2.2 0 0 1 15.2 4C15.2 6.2 12 8.1 12 8.1z"/></symbol>
<symbol id="s-kautsar" viewBox="0 0 24 24"><ellipse cx="12" cy="19" rx="7.8" ry="2.1"/><path d="M12 18V7M12 9c-1.5-2.3-3.1-3.2-4.8-2.5 0 3 1.7 5.1 4.8 6.3M12 9c1.5-2.3 3.1-3.2 4.8-2.5 0 3-1.7 5.1-4.8 6.3M12 7c0-2-1-3.3-2.6-4M12 7c0-2 1-3.3 2.6-4"/></symbol>
<symbol id="s-kafirun" viewBox="0 0 24 24"><path d="M12 20v-5c0-4-2.2-7.2-7.4-9.6M12 20v-5c0-4 2.2-7.2 7.4-9.6"/><path d="M4.6 5.4 2.8 4.2M19.4 5.4 21.2 4.2"/></symbol>
<symbol id="s-nasr" viewBox="0 0 24 24"><path d="M4 20V8h16v12M8 20v-5a4 4 0 0 1 8 0v5"/><path d="m12 3.2.8 1.8 2 .3-1.4 1.3.3 2-1.7-.9-1.7.9.3-2-1.4-1.3 2-.3z"/></symbol>
<symbol id="s-masad" viewBox="0 0 24 24"><path d="M5.2 9.5c2.2-5.2 11.4-5.2 13.6 0 2 4.9-1.7 8.5-6.8 8.5S3.2 14.4 5.2 9.5z"/><path d="M7.1 7.2c3.3 2.2 6.5 2.2 9.8 0M5.3 11.1c4.5 2.8 8.9 2.8 13.4 0M6.3 15c3.8 2.1 7.6 2.1 11.4 0M18.2 16.2c1.8.7 2.6 2 2.5 4"/></symbol>
<symbol id="s-ikhlas" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7.4"/><circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none"/><path d="M12 2.3v2.3M12 19.4v2.3M2.3 12h2.3M19.4 12h2.3"/></symbol>
<symbol id="s-falaq" viewBox="0 0 24 24"><path d="M3 18h6.2L12 15l2.8 3H21"/><path d="M12 4v7M6.8 7.2 9 9.4M17.2 7.2 15 9.4M3.8 12h3.1M17.1 12h3.1"/></symbol>
<symbol id="s-nas" viewBox="0 0 24 24"><circle cx="12" cy="7" r="3"/><path d="M6.8 20a5.2 5.2 0 0 1 10.4 0"/><circle cx="5.2" cy="9.2" r="2.2"/><path d="M1.7 19a3.8 3.8 0 0 1 5.4-3.5"/><circle cx="18.8" cy="9.2" r="2.2"/><path d="M22.3 19a3.8 3.8 0 0 0-5.4-3.5"/></symbol>`;

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
