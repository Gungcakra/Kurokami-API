# Kurokami API

Kurokami API adalah sebuah API yang menyediakan data terkait manhwa dan manga. API ini memungkinkan Anda untuk mengakses berbagai informasi mengenai manhwa, termasuk daftar manhwa, manhwa populer, manhwa terbaru, genre manhwa, pencarian manhwa, serta chapter dari manhwa. API ini dibangun menggunakan Express.js.

## Fitur

- **Daftar Manhwa**: Mendapatkan daftar semua manhwa yang tersedia.
- **Manhwa Populer**: Mengambil daftar manhwa yang sedang populer.
- **Manhwa Terbaru**: Menyediakan informasi tentang manhwa terbaru.
- **Genre Manhwa**: Menyediakan daftar genre yang tersedia untuk manhwa.
- **Pencarian Manhwa**: Mencari manhwa berdasarkan query tertentu.
- **Chapter Manhwa**: Mengambil informasi mengenai chapter dari sebuah manhwa dan gambar dari chapter sehingga dapat dibaca

## Teknologi

- **Express.js**: Framework backend minimalis untuk API.
- **Node.js**: JavaScript runtime yang digunakan sebagai basis aplikasi server.
- **Vercel**: Platform hosting untuk API ini.

## URL API

API ini dapat diakses melalui URL berikut:

https://kurokami.vercel.app/api/$endpoint

Gantilah `$endpoint` dengan endpoint yang sesuai dari daftar di bawah.

## Daftar Endpoint

### 1. Manhwa Baru
- **GET** `/manhwa-new`
  
  Mendapatkan daftar manhwa terbaru.
  
  **Contoh:**  
  `https://kurokami.vercel.app/api/manhwa-new`

### 2. Detail Manhwa
- **GET** `/manhwa-detail/:manhwaId`

  Mendapatkan detail spesifik dari sebuah manhwa berdasarkan `manhwaId`.

  **Contoh:**  
  `https://kurokami.vercel.app/api/manhwa-detail/the-nano-machine`

### 3. Manhwa Populer
- **GET** `/manhwa-recomendation`

  Mendapatkan daftar manhwa yang sedang populer.

  **Contoh:**  
  `https://kurokami.vercel.app/api/manhwa-recomendation`

### 4. Rekomendasi Manhwa
- **GET** `/manhwa-recomend`

  Mendapatkan daftar rekomendasi manhwa.

  **Contoh:**  
  `https://kurokami.vercel.app/api/manhwa-recomend`

### 5. Manhwa Ongoing
- **GET** `/manhwa-ongoing`

  Mendapatkan daftar manhwa yang sedang ongoing.

  **Contoh:**  
  `https://kurokami.vercel.app/api/manhwa-ongoing`

### 6. Detail Chapter Manhwa
- **GET** `/chapter/:chapterId`

  Mendapatkan detail dari chapter manhwa berdasarkan `chapterId`, termasuk gambar panel manhwa yang bisa dibaca.

  **Contoh:**  
  `https://kurokami.vercel.app/api/chapter/the-nano-machine-chapter-1`

### 7. List Genre
- **GET** `/data`

  Mendapatkan daftar genre manhwa yang tersedia.

  **Contoh:**  
  `https://kurokami.vercel.app/api/data`

### 8. Manhwa Berdasarkan Genre
- **GET** `/genre/:genreId`

  Mendapatkan daftar manhwa berdasarkan genre tertentu.

  **Contoh:**  
  `https://kurokami.vercel.app/api/genre/action`

### 9. Pencarian Manhwa
- **GET** `/search/:searchId`

  Mendapatkan daftar manhwa berdasarkan kata kunci pencarian.

  **Contoh:**  
  `https://kurokami.vercel.app/api/search/nano%20machine`
