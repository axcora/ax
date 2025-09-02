---
title: "Bangun Website Tanpa Node_modules Gemuk"
date: "2023-08-15"
excerpt: "Kita bisa membuat website modern dengan dependensi minimal..."
description: "Panduan praktis membangun website modern tanpa dependency berlebihan - hanya 80KB node_modules!"
image: "/assets/img/ax-1.jpg"
tags: 
  - Sosoro
  - Rujak
  - Semangka
  - Melon
---
# Rahasia Website Cepat: Kurangi Dependensi!

Bayangkan website yang **loading-nya 0.5 detik** karena kita hanya bawa yang benar-benar penting:

```js
// Contoh script tanpa dependensi berlebihan
const posts = db.getAllPosts().filter(p => p.published);

Mengapa Ini Penting?

🚀 Performa lebih kencang

💸 Biaya hosting lebih murah

😌 Mental lebih tenang (tidak khawatir vulnerability)

"Simplicity is the ultimate sophistication." - Leonardo da Vinci

text

---

### 🖼️ **Preview Visual Tema "Aura"**
+-------------------------------------+
| Aura Blog |
| [Home] [Tentang] |
+-------------------------------------+
| |
| [CARD BLOG 1] |
| Judul Artikel |
| 15 Agustus 2023 |
| Rahasia Website Cepat... |
| |
| [CARD BLOG 2] |
| ... |
| |
| ← Sebelumnya Selanjutnya → |
| |
+-------------------------------------+
| © 2023 Dibangun dengan ❤️... |
+-------------------------------------+

text
- **Card-based layout** dengan hover effect  
- **Tipografi legible** dengan line height ideal  
- **Navigasi intuitif** (next/prev di footer card)  
- **Fully responsive** sampai HP kecil  

---

### 🛠️ **Cara Aktifkan Tema Ini**

1. Buat folder sesuai struktur di atas
2. Simpan CSS di `assets/css/style.css`
3. Salin template ke folder `templates/`
4. Tambahkan 2 contoh konten blog
5. Jalankan build:  
   ```bash
   
   
   node build.js