<meta property="og:image" content="panel.png">
<meta property="og:title" content="Kurokami - Manhwa&Manga API">
<meta property="og:description" content="Manhwa Manga Scrapper">
<meta property="og:url" content="https://github.com/Gungcakra/Kurokami-API">

# Kurokami API
An API that provides data related to manhwa and manga. This API allows you to access various information about manhwa, including manhwa lists, popular manhwa, the latest releases, manhwa genres, manhwa search, and specific chapters of a manhwa. The API is built using Express.js, with several features powered by web scraping to fetch real-time data from external sources.

## Features

- **Manhwa List**: Retrieve a list of all available manhwa.
- **Popular Manhwa**: Get a list of currently popular manhwa.
- **Latest Manhwa**: Provides information about the latest manhwa releases.
- **Manhwa Genres**: Offers a list of available genres for manhwa.
- **Manhwa Search**: Search for manhwa based on a specific query.
- **Manhwa Chapter**: Retrieve information about a manhwa's chapters, including chapter images for reading, using scraping techniques to dynamically fetch content from other websites.

## TechStack

- **Express.js**
- **Node.js**
- **Axios**
- **Cheerio**
- **Vercel**

## API URL

The API can be accessed via the following URL:

https://kurokami.vercel.app/api/$endpoint

Replace `$endpoint` with the appropriate endpoint from the list below.

## Endpoint List

### 1. New Manhwa
- **GET** `/manhwa-new`
  
  Retrieve a list of the latest manhwa releases.
  
  **Example:**  
  `https://kurokami.vercel.app/api/manhwa-new`

### 2. Manhwa Details
- **GET** `/manhwa-detail/:manhwaId`

  Retrieve specific details of a manhwa based on `manhwaId`.

  **Example:**  
  `https://kurokami.vercel.app/api/manhwa-detail/nano-machine`

### 3. Popular Manhwa
- **GET** `/manhwa-recomendation`

  Retrieve a list of currently popular manhwa.

  **Example:**  
  `https://kurokami.vercel.app/api/manhwa-recomendation`

### 4. Manhwa Recommendations
- **GET** `/manhwa-recomend`

  Retrieve a list of recommended manhwa.

  **Example:**  
  `https://kurokami.vercel.app/api/manhwa-recomend`

### 5. Ongoing Manhwa
- **GET** `/manhwa-ongoing`

  Retrieve a list of currently ongoing manhwa.

  **Example:**  
  `https://kurokami.vercel.app/api/manhwa-ongoing`

### 6. Chapter Details
- **GET** `/chapter/:chapterId`

  Retrieve details of a manhwa chapter based on `chapterId`, including panel images that can be read. Chapter content is fetched through scraping to ensure real-time access to the latest chapters.

  **Example:**  
  `https://kurokami.vercel.app/api/chapter/nano-machine-chapter-1`

### 7. Genre List
- **GET** `/data`

  Retrieve a list of available manhwa genres.

  **Example:**  
  `https://kurokami.vercel.app/api/data`

### 8. Manhwa by Genre
- **GET** `/genre/:genreId`

  Retrieve a list of manhwa based on a specific genre.

  **Example:**  
  `https://kurokami.vercel.app/api/genre/action`

### 9. Manhwa Search
- **GET** `/search/:searchId`

  Retrieve a list of manhwa based on a search query.

  **Example:**  
  `https://kurokami.vercel.app/api/search/nano%20machine`
