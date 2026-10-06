# Website DKC Bantul 2026–2031

Prototype website responsif untuk Dewan Kerja Cabang Gerakan Pramuka Bantul masa bakti 2026–2031.

## Fitur
- Beranda dengan identitas dan motto “Teguh Hati, Bakti Diri, Ikhlas Mengabdi Ibu Pertiwi”.
- Profil, visi, misi, dan penjelasan singkat Dewan Kerja.
- Struktur organisasi 12 posisi dari Ketua hingga Anggota bidang.
- Menu **Kelola** untuk demo menambah pengurus, foto, biodata, program kerja, informasi, kegiatan, dan dokumen PDF.
- PDF dapat dibuka di pembaca dokumen bawaan browser.
- Form Usul & Saran.
- Rekap usul/saran dapat diekspor ke format Excel (.xls) atau dicetak menjadi PDF.
- Mobile-first dan responsif untuk HP, tablet, dan desktop.

## Menjalankan
Buka `index.html` di browser modern. Tidak membutuhkan build system.

## Catatan penting untuk versi resmi/produksi
Versi ini adalah **frontend prototype**. Data dan upload tersimpan di browser perangkat melalui localStorage sehingga belum cocok sebagai sistem multi-admin/multi-pengguna.

Untuk website resmi yang dapat diakses bersama oleh seluruh warga Pramuka, tahap berikutnya adalah menghubungkan:
1. Hosting + domain resmi.
2. Database (mis. PostgreSQL/Supabase/Firebase).
3. Storage dokumen/foto.
4. Login admin dan hak akses pengelola.
5. Form saran yang masuk ke database dan dapat diunduh oleh admin.
6. CMS agar pengurus tidak perlu mengedit kode.

Logo DKC Bantul pada folder `assets` berasal dari gambar yang diberikan pengguna.
