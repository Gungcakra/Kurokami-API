// Import modul yang dibutuhkan
import express from 'express';
import axios from 'axios';
import { load } from 'cheerio';  // Menggunakan named import untuk cheerio
import cors from 'cors';
// Inisialisasi aplikasi Express
const app = express();
const PORT = 3000;

app.use(cors());

// POPULAR MANHWA
app.get('/api/manhwa-popular', async (req, res) => {
  try {
    // URL yang akan di-scrape
    const url = 'https://manhwaindo.net/';

    // Ambil HTML dari URL menggunakan axios
    const { data } = await axios.get(url);

    // Muat HTML ke cheerio
    const $ = load(data);

    // Scraping data dari elemen yang diberikan
    const results = [];
    
    $('.bs').each((index, element) => {
      if (index < 7) { // Ambil hanya 7 data pertama
        const title = $(element).find('.tt').text().trim();
        const chapter = $(element).find('.epxs').text().trim();
        const rating = $(element).find('.numscore').text().trim();
        const imageSrc = $(element).find('img').attr('data-lazy-src');
        const link = $(element).find('a').attr('href');
        
        results.push({
          title,
          chapter,
          rating,
          imageSrc,
          link
        });
      }
    });

    // Kirim hasil scraping sebagai respons JSON
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while scraping data');
  }
});

// POPULAR MANHWA


// RECOMMEND
app.get('/api/manhwa-recomendation', async (req, res) => {
  try {
    // URL yang akan di-scrape
    const url = 'https://manhwaindo.net/series/?status=ongoing&type=&order=popular';

    // Ambil HTML dari URL menggunakan axios
    const { data } = await axios.get(url);

    // Muat HTML ke cheerio
    const $ = load(data);

    // Scraping data dari elemen yang diberikan
    const results = [];
    
    $('.bs').each((index, element) => {
      if (index < 30) { // Ambil hanya 7 data pertama
        const title = $(element).find('.tt').text().trim();
        const chapter = $(element).find('.epxs').text().trim();
        const rating = $(element).find('.numscore').text().trim();
        const imageSrc = $(element).find('img').attr('data-lazy-src');
        const link = $(element).find('a').attr('href');
        
        results.push({
          title,
          chapter,
          rating,
          imageSrc,
          link
        });
      }
    });

    // Kirim hasil scraping sebagai respons JSON
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while scraping data');
  }
});

// RECOMMEND


// NEW MANHWA
app.get('/api/manhwa-new', async (req, res) => {
    try {
      const url = 'https://manhwaindo.net/';
      const { data } = await axios.get(url);
      const $ = load(data);
  
      const results = [];
      
      $('.utao').each((index, element) => {
        const title = $(element).find('.luf h4').text().trim();
        const link = $(element).find('.luf a.series').attr('href');
        const imageSrc = $(element).find('.imgu img').attr('data-lazy-src');
        const chapters = [];
        
        $(element).find('.luf ul.Manhwa li').each((i, el) => {
          const chapterLink = $(el).find('a').attr('href');
          const chapterTitle = $(el).find('a').text().trim();
          const timeAgo = $(el).find('span').text().trim();
          
          chapters.push({
            chapterLink,
            chapterTitle,
            timeAgo
          });
        });
        
        results.push({
          title,
          link,
          imageSrc,
          chapters
        });
      });
  
      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error occurred while scraping data');
    }
  });
// NEW MANHWA

// MANHWA RECOMMEND
app.get('/api/manhwa-recommend', async (req, res) => {
  const url = 'https://manhwaindo.net/';

  try {
      const { data } = await axios.get(url);
      const $ = load(data);
      const recommendations = [];

      $('.serieslist.pop.wpop.wpop-weekly ul li').each((index, element) => {
          const item = {};
          const img = $(element).find('.imgseries img');
          
          item.rank = $(element).find('.ctr').text().trim();
          item.title = $(element).find('.leftseries h2 a').text().trim();
          item.url = $(element).find('.leftseries h2 a').attr('href');
          item.image = img.attr('data-lazy-src');
          item.genres = $(element).find('.leftseries span').text().replace('Genres: ', '').split(', ');
          item.rating = $(element).find('.numscore').text().trim();

          recommendations.push(item);
      });

      res.json(recommendations);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching data' });
  }
});
// MANHWA RECOMMEND

// DATA GENRE
  app.get('/api/data', async (req, res) => {
    try {
        const url = 'https://manhwaindo.net/series/list-mode/'; // Replace with the actual URL
        const { data } = await axios.get(url);
        const $ = load(data);

        const genres = [];

        $('.dropdown-menu.c4.genrez li').each((index, element) => {
            const genreLabel = $(element).find('label').text().trim();
            const genreValue = $(element).find('input').val();

            if (genreLabel && genreValue) {
                genres.push({ label: genreLabel, value: genreValue });
            }
        });

        res.json({ genres });
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// DATA GENRE

// GENRE RESULT
app.get('/api/genre/:genreId', async (req, res) => {
  const { genreId } = req.params;
  const url = `https://manhwaindo.net/genres/${genreId}`;

  try {
    const { data } = await axios.get(url);
    const $ = load(data);
    const seriesList = [];

    $('.bs').each((index, element) => {
      const series = {};
      const bsx = $(element).find('.bsx');

      series.title = bsx.find('a').attr('title');
      series.url = bsx.find('a').attr('href');
      series.image = bsx.find('img').attr('data-lazy-src');
      series.latestChapter = bsx.find('.epxs').text();
      series.rating = bsx.find('.numscore').text();

      seriesList.push(series);
    });

    // Pagination data extraction
    const pagination = [];
    $('.pagination a.page-numbers').each((index, element) => {
      const pageUrl = $(element).attr('href');
      const pageNumber = $(element).text();
      pagination.push({ pageUrl, pageNumber });
    });

    const nextPage = $('.pagination a.next.page-numbers').attr('href');

    res.json({ seriesList, pagination, nextPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});
app.get('/api/genre/:genreId/page/:pageNumber', async (req, res) => {
  const { genreId, pageNumber } = req.params;
  const url = `https://manhwaindo.net/genres/${genreId}/page/${pageNumber}`;

  try {
    const { data } = await axios.get(url);
    const $ = load(data);
    const seriesList = [];

    $('.bs').each((index, element) => {
      const series = {};
      const bsx = $(element).find('.bsx');

      series.title = bsx.find('a').attr('title');
      series.url = bsx.find('a').attr('href');
      series.image = bsx.find('img').attr('data-lazy-src');
      series.latestChapter = bsx.find('.epxs').text();
      series.rating = bsx.find('.numscore').text();

      seriesList.push(series);
    });

    // Pagination data extraction, explicitly excluding 'Sebelumnya' and 'Berikutnya'
    const pagination = [];
    $('.pagination a.page-numbers').each((index, element) => {
      const pageText = $(element).text().trim().toLowerCase();
      
      // Skip pagination entries for 'Sebelumnya' and 'Berikutnya'
      if (pageText !== '« sebelumnya' && pageText !== 'berikutnya »') {
        const pageUrl = $(element).attr('href');
        const pageNumber = $(element).text();
        pagination.push({ pageUrl, pageNumber });
      }
    });

    res.json({ seriesList, pagination });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});


// GENRE RESULT


// SEARCH RESULT
app.get('/api/search/:searchId', async (req, res) => {
  const { searchId } = req.params;
  const url = `https://manhwaindo.net/?s=${searchId}`;

  try {
    const { data } = await axios.get(url);
    const $ = load(data);
    const seriesList = [];

    $('.bs').each((index, element) => {
      const series = {};
      const bsx = $(element).find('.bsx');

      series.title = bsx.find('a').attr('title');
      series.url = bsx.find('a').attr('href');
      series.image = bsx.find('img').attr('src');
      series.latestChapter = bsx.find('.epxs').text();
      series.rating = bsx.find('.numscore').text();

      seriesList.push(series);
    });

    // Pagination data extraction
    const pagination = [];
    $('.pagination a.page-numbers').each((index, element) => {
      const pageUrl = $(element).attr('href');
      const pageNumber = $(element).text();
      pagination.push({ pageUrl, pageNumber });
    });

    const nextPage = $('.pagination a.next.page-numbers').attr('href');

    res.json({ seriesList, pagination, nextPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});
app.get('/api/page/:pageNumber/search/:searchId', async (req, res) => {
  const { searchId, pageNumber } = req.params;
  const url = `https://manhwaindo.net/page/${pageNumber}/?s=${searchId}`;

  try {
    const { data } = await axios.get(url);
    const $ = load(data);
    const seriesList = [];

    $('.bs').each((index, element) => {
      const series = {};
      const bsx = $(element).find('.bsx');

      series.title = bsx.find('a').attr('title');
      series.url = bsx.find('a').attr('href');
      series.image = bsx.find('img').attr('src');
      series.latestChapter = bsx.find('.epxs').text();
      series.rating = bsx.find('.numscore').text();

      seriesList.push(series);
    });

    // Pagination data extraction, explicitly excluding 'Sebelumnya' and 'Berikutnya'
    const pagination = [];
    $('.pagination a.page-numbers').each((index, element) => {
      const pageText = $(element).text().trim().toLowerCase();
      
      // Skip pagination entries for 'Sebelumnya' and 'Berikutnya'
      if (pageText !== '« sebelumnya' && pageText !== 'berikutnya »') {
        const pageUrl = $(element).attr('href');
        const pageNumber = $(element).text();
        pagination.push({ pageUrl, pageNumber });
      }
    });

    res.json({ seriesList, pagination });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});
// SEARCH RESULT

// MANHWA DETAL
app.get('/api/manhwa-detail/:manhwaId', async (req, res) => {
  const manhwaId = req.params.manhwaId;
  const url = `https://manhwaindo.net/series/${manhwaId}`;

  try {
      const { data } = await axios.get(url);
      const $ = load(data);

      const title = $('.info-desc h1.entry-title').text().trim();
      const imageSrc = $('.info-left .thumb img').attr('data-lazy-src');
      const rating = $('.info-left .rating .num').text().trim();
      const status = $('.info-left .tsinfo .imptdt').eq(0).text().trim().replace('Status ', '');
      const type = $('.info-left .tsinfo .imptdt').eq(1).text().trim().replace('Type ', '');
      const author = $('.info-left .tsinfo .imptdt').eq(2).text().trim().replace('Author ', '');
      const postedBy = $('.info-left .tsinfo .imptdt').eq(3).text().trim().replace('Posted By ', '');
      const postedOn = $('.info-left .tsinfo .imptdt').eq(4).text().trim().replace('Posted On ', '');
      const updatedOn = $('.info-left .tsinfo .imptdt').eq(5).text().trim().replace('Updated On ', '');
      
      // Mengambil views jika tersedia
      const viewsElement = $('.info-left .tsinfo .imptdt').eq(6).text().trim();
      const views = viewsElement.startsWith('Views ') ? viewsElement.replace('Views ', '') : 'N/A';
      
      const synopsis = $('.info-desc .entry-content.entry-content-single').text().trim();
      
      // Mengambil genre
      const genres = [];
      $('.mgen a').each((index, element) => {
          const genreName = $(element).text().trim();
          const genreLink = $(element).attr('href');
          genres.push({
              genreName,
              genreLink
          });
      });
      
      const chapters = [];
      $('#chapterlist ul li').each((index, element) => {
          const chapterLink = $(element).find('a').attr('href');
          const chapterTitle = $(element).find('.chapternum').text().trim();
          const chapterDate = $(element).find('.chapterdate').text().trim();
  
          chapters.push({
              chapterLink,
              chapterTitle,
              chapterDate
          });
      });

      const manhwaDetails = {
          title,
          imageSrc,
          rating,
          status,
          type,
          author,
          postedBy,
          postedOn,
          updatedOn,
          views,
          synopsis,
          genres,
          chapters
      };

      res.json(manhwaDetails);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error occurred while scraping data');
  }
});

// MANHWA DETAIL

// MANHWA-ONGOING
app.get('/api/manhwa-ongoing', async (req, res) => {
  try {
      const url = 'https://manhwaindo.net/series/?status=ongoing&type=manhwa&order=';
      const response = await axios.get(url);
      const html = response.data;
      const $ = load(html);

      const manhwaList = [];

      $('.bs').each((index, element) => {
          const title = $(element).find('.bigor .tt').text().trim();
          const imageUrl = $(element).find('img').attr('data-lazy-src');
          const link = $(element).find('a').attr('href');
          const latestChapter = $(element).find('.epxs').text().trim();
          const rating = $(element).find('.numscore').text().trim();

          manhwaList.push({
              title,
              imageUrl,
              link,
              latestChapter,
              rating
          });
      });

      res.send(manhwaList);
  } catch (error) {
      res.status(500).send({
          message: 'Gagal mengambil data manhwa ongoing.',
          error: error.message
      });
  }
});

// MANHWA-ONGOING



// READ CHAPTER
app.get('/api/chapter/:chapterId', async (req, res) => {
  const { chapterId } = req.params;
  const url = `https://manhwaindo.net/${chapterId}`; // Sesuaikan URL jika perlu

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = load(html);

    // Ambil judul bab
    const title = $('h1.entry-title').text().trim();

    // Ambil gambar dari halaman
    const images = [];
    $('#readerarea img').each((index, element) => {
      const imgSrc = $(element).attr('data-lazy-src') || $(element).attr('src');
      if (imgSrc && imgSrc !== 'https://img.manhwaindo.id/ads/Manhwaland Banner-min.jpg') {
        images.push(imgSrc);
      }
    });

    // Temukan dan ambil skrip yang mengandung objek ts_reader
    const scriptContent = $('script').filter((i, el) => {
      return $(el).html().includes('ts_reader.run');
    }).html();

    // Ekstrak objek JSON dari skrip
    const jsonString = scriptContent.match(/ts_reader\.run\((.*?)\);/)[1];
    const jsonObject = JSON.parse(jsonString);

    // Ambil URL untuk bab sebelumnya dan berikutnya
    const prevChapter = jsonObject.prevUrl || null;
    const nextChapter = jsonObject.nextUrl || null;

    // Ambil daftar chapter dari elemen <select> di dalam elemen .nvx
    const chapters = [];
    $('.nvx #chapter option').each((index, element) => {
      const chapterTitle = $(element).text().trim();
      const chapterUrl = $(element).attr('value');

      // Skip the first option which is "Select Chapter"
      if (chapterTitle !== "Select Chapter") {
        chapters.push({
          title: chapterTitle,
          url: chapterUrl
        });
      }
    });

    res.json({
      title,
      images,
      prevChapter,
      nextChapter,
      chapters // Menambahkan daftar chapter ke dalam respons JSON
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch chapter data' });
  }
});


// READ CHAPTER
  

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
