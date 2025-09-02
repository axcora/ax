---
title: "Mengapa Website Modern Tidak Perlu 100 Dependency"
date: "2023-08-16"
description: "Analisis mendalam tentang beban berlebihan di ekosistem JavaScript..."
image: "/assets/img/ax.jpg"
tags: 
  - JavaScript
  - Web Development
  - ES6
  - Modern Web
---
# Dependency Hell di JavaScript

Setiap kali kita `npm install`...

ya begitu lah

## Data Menarik
- Rata-rata proyek JS memiliki **137 dependency transitive**
- 70% kode di node_modules **tidak pernah dipakai**
- Website dengan 50MB node_modules **hanya perlu 80KB**

## Solusi Nyata
1. Gunakan modul native Node.js
2. Pilih library spesifik (bukan framework)
3. Build script custom > config generator
