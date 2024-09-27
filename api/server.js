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
    const url = 'https://kiryuu.org/';

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
        const imageSrc = $(element).find('img').attr('src');
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
    const url = 'https://kiryuu.org/series/?status=ongoing&type=&order=popular';

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
        const imageSrc = $(element).find('img').attr('src');
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
      const url = 'https://kiryuu.org/';
      const { data } = await axios.get(url);
      const $ = load(data);
  
      const results = [];
      
      $('.utao').each((index, element) => {
        const title = $(element).find('.luf h4').text().trim();
        const link = $(element).find('.luf a.series').attr('href');
        const imageSrc = $(element).find('.imgu img').attr('src');
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
  const url = 'https://kiryuu.org/';

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
          item.image = img.attr('src');
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
        const url = 'https://kiryuu.org/series/list-mode/'; // Replace with the actual URL
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
  const url = `https://kiryuu.org/genres/${genreId}`;

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
app.get('/api/genre/:genreId/page/:pageNumber', async (req, res) => {
  const { genreId, pageNumber } = req.params;
  const url = `https://kiryuu.org/genres/${genreId}/page/${pageNumber}`;

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


// GENRE RESULT


// SEARCH RESULT
app.get('/api/search/:searchId', async (req, res) => {
  const { searchId } = req.params;
  const url = `https://kiryuu.org/?s=${searchId}`;

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
  const url = `https://kiryuu.org/page/${pageNumber}/?s=${searchId}`;

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
  const url = `https://kiryuu.org/manga/${manhwaId}`;

  try {
      const { data } = await axios.get(url);
      const $ = load(data);

      // Extract title, image, rating, and follow information
      const title = $('.seriestucontl .thumb img').attr('title');
      const imageSrc = $('.seriestucontl .thumb img').attr('src');
      const rating = $('.seriestucontl .rating .num').text().trim();
      const followedBy = $('.seriestucontl .bmc').text().trim();

      // Extract synopsis
      const synopsis = $('.seriestucontentr .entry-content').text().trim();

      // Extract the first and latest chapter
      const firstChapterLink = $('.lastend .inepcx').first().find('a').attr('href');
      const firstChapterTitle = $('.lastend .inepcx').first().find('.epcur').text().trim();
      const latestChapterLink = $('.lastend .inepcx').last().find('a').attr('href');
      const latestChapterTitle = $('.lastend .inepcx').last().find('.epcur').text().trim();

      // Extract details from the table (Status, Type, Released, etc.)
      const status = $('table.infotable tr').eq(0).find('td').eq(1).text().trim();
      const type = $('table.infotable tr').eq(1).find('td').eq(1).text().trim();
      const released = $('table.infotable tr').eq(2).find('td').eq(1).text().trim();
      const author = $('table.infotable tr').eq(3).find('td').eq(1).text().trim();
      const artist = $('table.infotable tr').eq(4).find('td').eq(1).text().trim();
      const postedBy = $('table.infotable tr').eq(5).find('i').text().trim();
      const postedOn = $('table.infotable tr').eq(6).find('time').text().trim();
      const updatedOn = $('table.infotable tr').eq(7).find('time').text().trim();
      const views = $('table.infotable tr').eq(8).find('.ts-views-count').text().trim();

      // Extract genres
      const genres = [];
      $('.seriestugenre a').each((index, element) => {
          const genreName = $(element).text().trim();
          const genreLink = $(element).attr('href');
          genres.push({
              genreName,
              genreLink
          });
      });

      const manhwaDetails = {
          title,
          imageSrc,
          rating,
          followedBy,
          synopsis,
          firstChapter: {
              title: firstChapterTitle,
              link: firstChapterLink
          },
          latestChapter: {
              title: latestChapterTitle,
              link: latestChapterLink
          },
          status,
          type,
          released,
          author,
          artist,
          postedBy,
          postedOn,
          updatedOn,
          views,
          genres
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
      const url = 'https://kiryuu.org/series/?status=ongoing&type=manhwa&order=';
      const response = await axios.get(url);
      const html = response.data;
      const $ = load(html);

      const manhwaList = [];

      $('.bs').each((index, element) => {
          const title = $(element).find('.bigor .tt').text().trim();
          const imageUrl = $(element).find('img').attr('src');
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
  const url = `https://kiryuu.org/${chapterId}`; // Sesuaikan URL jika perlu

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = load(html);

    // Ambil judul bab
    const title = $('h1.entry-title').text().trim();

    // Fungsi untuk menunggu (delay)
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Tunggu 1 detik sebelum mengambil gambar
    await delay(1000); 

    // Temukan dan ambil skrip yang mengandung objek ts_reader
    const scriptContent = $('script').filter((i, el) => {
      return $(el).html().includes('ts_reader.run');
    }).html();

    // Ekstrak objek JSON dari skrip
    const jsonString = scriptContent.match(/ts_reader\.run\((.*?)\);/)[1];
    const jsonObject = JSON.parse(jsonString);

    // Ambil gambar dari sumber yang ditentukan
    const images = jsonObject.sources[0].images;

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

    // Mengirim respons JSON berisi data judul, gambar, bab sebelumnya, bab berikutnya, dan daftar chapter
    res.json({
      title,
      images,
      prevChapter,
      nextChapter,
      chapters
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
