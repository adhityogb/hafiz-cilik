# Hafiz Cilik

Aplikasi web untuk anak mendengar dan menghafal Juz 30 (surah 78–114). Bisa
dipasang di layar utama ponsel dan dipakai tanpa internet setelah surahnya
disimpan.

## Isi

| Berkas | Guna |
| --- | --- |
| `index.html` | rangka app + sprite ikon SVG |
| `app.css` | seluruh gaya, tanpa Tailwind CDN |
| `app.js` | logika pemutar, pengulangan, penyimpanan |
| `data.js` | data 37 surah + nomor ayat global |
| `sw.js` | service worker (offline) |
| `manifest.webmanifest`, `icons/` | supaya bisa dipasang sebagai aplikasi |

Tidak ada langkah build. Salin folder ini ke hosting statis apa pun.

## Menjalankan

Service worker hanya aktif di `https://` atau `http://localhost`, jadi jangan
buka lewat `file://`.

```bash
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

GitHub Pages: dorong folder ini ke repo, aktifkan Pages, selesai. Semua jalur
di dalam app relatif (`./`), jadi aman berada di subfolder seperti
`username.github.io/hafiz-cilik/`.

## Cara kerja audio

URL audio disusun sendiri di perangkat, tanpa memanggil API:

```
https://cdn.islamic.network/quran/audio/128/{qari}/{nomor ayat global}.mp3
```

Nomor ayat global tiap surah tersimpan di `data.js` (kolom `start`) dan sudah
diverifikasi lewat tiga titik acuan: total 6236 ayat, ayat pertama An-Naba' =
5673, dan An-Nas = 6231–6236. Akibatnya daftar ayat langsung muncul walau
sedang tanpa internet.

Teks Arab, latin, dan artinya diambil dari `api.alquran.cloud` (tiga edisi
dalam satu permintaan), lalu disimpan supaya pembukaan berikutnya tidak
memerlukan jaringan. Kalau nomor ayat dari API ternyata berbeda dari data
lokal, app memakai nomor dari API dan mencatat peringatan di console — jadi
tidak akan pernah memutar ayat yang salah.

Kalau suatu qari mengembalikan 404, ganti qari di **Pengaturan**. Daftar qari
ada di `RECITERS` dalam `data.js`.

## Penyimpanan

| Cache | Isi | Kapan dihapus |
| --- | --- | --- |
| `hafiz-shell-v1` | html, css, js, ikon | saat `VERSION` di `sw.js` dinaikkan |
| `hafiz-fonts-v1` | font Google | idem |
| `hafiz-text-v1` | jawaban API teks ayat | idem |
| `hafiz-audio-v1` | mp3 yang disimpan pengguna | hanya lewat tombol di Pengaturan |

Cache audio sengaja tidak diberi nomor versi supaya audio yang sudah diunduh
anak tidak terhapus setiap app diperbarui.

Bintang, surah yang sudah selesai, dan pilihan pengaturan disimpan di
`localStorage` lewat pembungkus yang tidak pernah melempar error — di mode
privat app tetap jalan, hanya tidak mengingat setelah ditutup.

**Setelah mengubah `app.css`/`app.js`, naikkan `VERSION` di `sw.js`.** Tanpa
itu perangkat yang sudah pernah membuka app akan tetap memakai versi lama.

## Yang menentukan di kode

1. **Satu objek `Audio`**, dibuka pada sentuhan pertama, setelahnya hanya
   `.src` yang diganti. Ini alasan "Putar semua" tidak diblokir Safari iOS —
   ayat kedua dan seterusnya dipicu dari `ended`, bukan dari sentuhan.
2. **Semua perubahan state pemutar lewat `stopAll()`**, sehingga tombol dan
   kartu ayat tidak pernah menampilkan keadaan yang berbeda dari audionya.
3. **Ayat berikutnya dipanaskan lebih dulu** (`warm()`) supaya sambungan antar
   ayat tidak menggantung.

## Catatan font

Font diambil dari Google Fonts dan di-cache service worker pada pemakaian
pertama, jadi buka app sekali dengan internet sebelum dipakai offline. Kalau
font Arab (`Amiri Quran`) belum terunduh, teks turun ke font Arab bawaan
perangkat — tetap terbaca, hanya bentuknya berbeda.

## Ide lanjutan

- Mode "tes hafalan": audio berhenti di tengah ayat, anak melanjutkan.
- Rentang ulang A–B untuk menghafal potongan surah panjang.
- Riwayat harian supaya orang tua tahu ayat mana yang paling sering diulang.
