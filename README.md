![Preview](panel.png)
# Kurokami API
Rest API Manhwa Bahasa Indonesia

## Source
https://komikstation.co/

## Fitur

- **Manhwa Terbaru**
- **Manhwa Populer**
- **Manhwa Top**
- **Manhwa Ongoing**
- **Manhwa Rekomendasi**
- **Genre Manhwa**
- **Manhwa By Genre**
- **Detail Manhwa**
- **Search Manhwa**
- **Chapter Manhwa**

## TechStack

- **Express.js**
- **Node.js**
- **Axios**
- **Cheerio**
- **Vercel**


## Installasi
```bash
# Clone repositori
git clone https://github.com/Gungcakra/kurokami-manhwa-api.git

# Masuk ke folder proyek
cd kurokami-manhwa-api

# Install dependensi
npm install

# Jalankan server
npm start

```

## Contoh Response
```json
{
    "title": "Return of The Greatest Lancer",
    "link": "https://komikstation.co/manga/return-of-the-greatest-lancer/",
    "imageSrc": "https://i0.wp.com/komikstation.co/wp-content/uploads/2021/09/Return-of-The-Greatest-Lancer-1.jpg?resize=100,130",
    "chapters": [
        {
            "chapterLink": "https://komikstation.co/return-of-the-greatest-lancer-chapter-151/",
            "chapterTitle": "Ch.151",
            "timeAgo": "3 jam lalu"
        },
        {
            "chapterLink": "https://komikstation.co/return-of-the-greatest-lancer-chapter-150/",
            "chapterTitle": "Ch.150",
            "timeAgo": "1 minggu lalu"
        },
        {
            "chapterLink": "https://komikstation.co/return-of-the-greatest-lancer-chapter-149/",
            "chapterTitle": "Ch.149",
            "timeAgo": "2 minggu lalu"
        }
    ]
}
```


## Routes
URL Utama API:

https://kurokami.vercel.app/api/$endpoint

Ganti `$endpoint` dengan list endpoint ini.

## Endpoint List

### 1. New Manhwa
- **GET** `/manhwa-new`
  
  Get list manhwa terbaru.
  
  **Example:**  
  `https://kurokami.vercel.app/api/manhwa-new`

### 2. Manhwa Populer
- **GET** `/manhwa-popular`

  Get list manhwa populer

  **Example:**  
  `https://kurokami.vercel.app/api/manhwa-popular`
  
### 3. Manhwa Top
- **GET** `/manhwa-top`

  Get list manhwa top

  **Example:**  
  `https://kurokami.vercel.app/api/manhwa-top`
  
### 4. Manhwa Ongoing
- **GET** `/manhwa-ongoing`

  Get list manhwa ongoing

  **Example:**  
  `https://kurokami.vercel.app/api/manhwa-ongoing`
  
### 5. Manhwa Rekomendasi
- **GET** `/manhwa-recommendation`

  Get list manhwa rekomendasi

  **Example:**  
  `https://kurokami.vercel.app/api/manhwa-recommendation`

  
### 6. Manhwa Details
- **GET** `/manhwa-detail/:manhwaId`

  Get detail manhwa sesuai  `manhwaId`.

  **Example:**  
  `https://kurokami.vercel.app/api/manhwa-detail/nano-machine`
  

### 7. Chapter Details
- **GET** `/chapter/:chapterId`

  Get detail chapter manhwa sesuai  `chapterId`

  **Example:**  
  `https://kurokami.vercel.app/api/chapter/nano-machine-chapter-1`
  

### 8. Genre List
- **GET** `/genres`

  Get list genre.

  **Example:**  
  `https://kurokami.vercel.app/api/genres`


### 9. Manhwa by Genre 
- **GET** `/genre/:genreId`

  Get list manhwa sesuai genre.

  **Example:**  
  `https://kurokami.vercel.app/api/genre/action`


  ### 10. Manhwa by Genre with Page
- **GET** `/genre/:genreId/page/:pageNumber`

  Get list manhwa sesuai genre dan page.

  **Example:**  
  `https://kurokami.vercel.app/api/genre/action/page/2`


### 11. Manhwa Search
- **GET** `/search/:searchId`

  Get list manhwa sesuai searchQuery.

  **Example:**  
  `https://kurokami.vercel.app/api/search/nano%20machine`

  
### 12. Manhwa Search with Page
- **GET** `/search/:searchId/page/:pageNumber`

  Get list manhwa sesuai searchQuery dan page.

  **Example:**  
  `https://kurokami.vercel.app/api/search/nano%20machine/page/2`
