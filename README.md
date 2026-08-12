# Hafizku

> **Nama produk:** Hafizku. Slug repo `hafiz-cilik` dipertahankan agar URL GitHub Pages dan instalasi lama tidak terputus.

Hafizku adalah PWA hafalan Juz 30 untuk anak: dengar ayat, ulangi dengan qari pilihan, pilih target hafalan, dan simpan surah agar tetap bisa diputar tanpa internet.

## Arsitektur

Repo ini **langsung berisi source aplikasi**. Tidak ada framework, bundler, npm, ZIP source, atau rangkaian patch build. GitHub Pages menerbitkan file root apa adanya.

| Berkas | Fungsi |
| --- | --- |
| `index.html` | struktur UI dan sprite SVG |
| `app.css` | seluruh tampilan |
| `app.js` | state, player, offline save, instalasi PWA |
| `data.js` | data Juz 30 + konfigurasi runtime bersama |
| `sw.js` | service worker offline-first |
| `manifest.webmanifest` | metadata PWA |
| `icons/` | ikon PWA yang sudah jadi |

Semua aset aplikasi memakai path relatif `./`, sehingga aman di subfolder GitHub Pages.

## Menjalankan lokal

Service worker membutuhkan HTTPS atau localhost:

```bash
python3 -m http.server 8000
# buka http://localhost:8000
```

Tidak ada langkah build.

## Cara kerja audio & offline

`data.js` adalah satu-satunya sumber konfigurasi host audio. `app.js` menyusun kandidat URL dari konfigurasi itu dan `sw.js` memuat `data.js` dengan `importScripts('./data.js')`, sehingga player dan service worker tidak bisa tertinggal memakai host berbeda.

Urutan sumber audio:

1. EveryAyah untuk qari yang dipilih.
2. EveryAyah Al-Afasy bila qari pilihan gagal.
3. The Quran Project mirror.
4. Quran Foundation Al-Afasy.

Tombol **Simpan surah untuk offline** mengambil audio tiap ayat dan memasukkannya ke cache persisten `hafiz-audio-v1`. Service worker membaca cache yang sama sebelum mencoba jaringan. Cache audio sengaja tidak memakai versi aplikasi supaya hafalan yang sudah disimpan tidak ikut terhapus saat aplikasi diperbarui.

### Tes manual audio offline (wajib sebelum rilis besar)

1. Buka Hafizku dengan jaringan aktif.
2. Pilih satu surah dan tekan **Simpan surah untuk offline** sampai 100%.
3. Buka DevTools → Network → pilih **Offline** (atau aktifkan mode pesawat di perangkat).
4. Putar ayat surah yang tadi disimpan.
5. Audio harus tetap berbunyi.

## Data Juz 30

Nilai `id`, `n`, dan `start` di `data.js` adalah data terverifikasi dan tidak boleh diubah sembarangan. CI menghitung fingerprint khusus untuk ketiga field itu dan gagal bila ada perubahan yang tidak disengaja.

`loadText()` memakai API Al-Qur'an hanya untuk teks Arab/latin/terjemahan. Bila nomor global dari API berbeda dengan data lokal, aplikasi mencatat peringatan integritas di console; pemetaan audio surah:ayat tidak diubah.

## Warna surah

Field `sky` di `data.js` adalah identitas visual semantik (`dawn`, `sun`, `sky`, `garden`, `dusk`, `night`). Kartu dan halaman detail memakai token yang sama, sehingga warna suatu surah tetap konsisten walaupun filter level berubah.

## Pemasangan ke layar utama

- Android/Chromium memakai `beforeinstallprompt` asli browser.
- iOS Safari menampilkan panduan Bagikan → Tambahkan ke Layar Utama → Tambah.
- iOS Chrome/Firefox/Edge meminta pengguna membuka Hafizku lewat Safari terlebih dahulu.
- Tawaran pemasangan tidak muncul ketika aplikasi sudah berjalan dalam mode standalone.

## Deployment

Push ke `main` memicu `.github/workflows/pages.yml`. CI hanya memverifikasi source (`node --check`, integritas data, konsistensi versi/path) lalu mengunggah root repo ke GitHub Pages. Tidak ada transformasi source saat deploy.
