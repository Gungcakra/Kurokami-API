import express from 'express';
import axios from 'axios';
import { load } from 'cheerio';  
import cors from 'cors';
const app = express();
const PORT = 3000;

app.use(cors());
// POPULAR MANHWA
app.get('/api/manhwa-popular', async (req, res) => {
  try {
    // URL yang akan di-scrape
    const url = 'https://komikstation.co/manga/?type=manhwa&order=popular';

    // Ambil HTML dari URL menggunakan axios
    const { data } = await axios.get(url);

    // Muat HTML ke cheerio
    const $ = load(data);

    // Scraping data dari elemen yang diberikan
    const results = [];
    
    $('.bs').each((index, element) => {
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
app.get('/api/manhwa-recommendation', async (req, res) => {
  try {
    // URLs that will be scraped
    const urls = [
      'https://komikstation.co/manga/?page=2&type=manhwa&order=popular',
      'https://komikstation.co/manga/?page=3&type=manhwa&order=popular'
    ];

    // Array to hold all scraped results
    const allResults = [];

    // Loop through each URL and scrape data
    for (const url of urls) {
      // Fetch HTML from each URL
      const { data } = await axios.get(url);

      // Load HTML into cheerio
      const $ = load(data);

      // Extract data from elements and add it to the results
      $('.bs').each((index, element) => {
        const title = $(element).find('.tt').text().trim();
        const chapter = $(element).find('.epxs').text().trim();
        const rating = $(element).find('.numscore').text().trim();
        const imageSrc = $(element).find('img').attr('src');
        const link = $(element).find('a').attr('href');

        allResults.push({
          title,
          chapter,
          rating,
          imageSrc,
          link
        });
      });
    }

    // Send all results as JSON response
    res.json(allResults);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while scraping data');
  }
});


// RECOMMEND


// NEW MANHWA
app.get('/api/manhwa-new', async (req, res) => {
    try {
      const url = 'https://komikstation.co/';
      const { data } = await axios.get(url);
      const $ = load(data);
  
      const results = [];
      
      $('.utao').each((index, element) => {
        const title = $(element).find('.luf h4').text().trim();
        const link = $(element).find('.luf a.series').attr('href');
        const imageSrc = $(element).find('.imgu img').attr('src');
        const chapters = [];
        
        const mangaList = $(element).find('.luf ul.Manga li');
        const manhwaList = $(element).find('.luf ul.Manhwa li');
        const manhuaList = $(element).find('.luf ul.Manhua li');
        const chapterElements = mangaList.length ? mangaList : manhwaList.length ? manhwaList : manhuaList;
        
        chapterElements.each((i, el) => {
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
  const url = 'https://komikstation.co/';

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
  app.get('/api/genres', async (req, res) => {
    try {
        const url = 'https://komikstation.co/manga/list-mode/'; // Replace with the actual URL
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
  const url = `https://komikstation.co/genres/${genreId}`;

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
  const url = `https://komikstation.co/genres/${genreId}/page/${pageNumber}`;

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
  const url = `https://komikstation.co/?s=${searchId}`;

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
  const url = `https://komikstation.co/page/${pageNumber}/?s=${searchId}`;

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
  const url = `https://komikstation.co/manga/${manhwaId}`;

  try {
    const { data } = await axios.get(url);
    const $ = load(data);

    // Extract title, image, rating, and follow information
    const title = $('.infox .entry-title').text().trim();
    const imageSrc = $('.thumb img').attr('src');
    const rating = $('.rating .num').text().trim();
    const followedBy = $('.bmc').text().trim();

    // Extract synopsis
    const synopsis = $('.entry-content.entry-content-single').text().trim();

    // Extract the first and latest chapter
    const firstChapterLink = $('.lastend .inepcx').first().find('a').attr('href');
    const firstChapterTitle = $('.lastend .inepcx').first().find('.epcurfirst').text().trim();
    const latestChapterLink = $('.lastend .inepcx').last().find('a').attr('href');
    const latestChapterTitle = $('.lastend .inepcx').last().find('.epcurlast').text().trim();

    // Extract details from the new layout (Status, Type, Released, etc.)
    const status = $('.tsinfo .imptdt').eq(0).find('i').text().trim();
    const type = $('.tsinfo .imptdt').eq(1).find('a').text().trim();
    const released = $('.fmed').eq(0).find('span').text().trim();
    const author = $('.fmed').eq(1).find('span').text().trim();
    const artist = $('.fmed').eq(2).find('span').text().trim();
    const updatedOn = $('.fmed').eq(3).find('time').text().trim();

    // Extract genres
    const genres = [];
    $('.mgen a').each((index, element) => {
      const genreName = $(element).text().trim();
      const genreLink = $(element).attr('href');
      genres.push({
        genreName,
        genreLink
      });
    });

    // Extract list of chapters
    const chapters = [];
    $('#chapterlist li').each((index, element) => {
      const chapterNum = $(element).find('.chapternum').text().trim();
      const chapterLink = $(element).find('.eph-num a').attr('href');
      const chapterDate = $(element).find('.chapterdate').text().trim();
      const downloadLink = $(element).find('.dload').attr('href');

      chapters.push({
        chapterNum,
        chapterLink,
        chapterDate,
        downloadLink
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
      updatedOn,
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
      const url = 'https://komikstation.co/manga/?status=ongoing&type=manhwa&order=';
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
  const url = `https://komikstation.co/${chapterId}`; // Adjust the URL if necessary

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = load(html);

    // Extract the chapter title
    const title = $('h1.entry-title').text().trim();

    // Function for delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Wait 1 second before extracting images
    await delay(1000);

    // Find and extract the script containing `ts_reader` object
    const scriptContent = $('script').filter((i, el) => {
      return $(el).html().includes('ts_reader.run');
    }).html();

    // Extract JSON object from the script
    const jsonString = scriptContent.match(/ts_reader\.run\((.*?)\);/)[1];
    const jsonObject = JSON.parse(jsonString);

    // Get images from the specified source
    const images = jsonObject.sources[0].images;

    // Extract URLs for previous and next chapters
    const prevChapter = jsonObject.prevUrl || null;
    const nextChapter = jsonObject.nextUrl || null;

    // Extract chapter list from the `<select>` element in both `.nvx` elements
    const chapters = [];
    $('.nvx #chapter option').each((index, element) => {
      const chapterTitle = $(element).text().trim();
      const chapterUrl = $(element).attr('value') || null; // Set URL to null if value is empty

      chapters.push({
        title: chapterTitle,
        url: chapterUrl
      });
    });

    // Extract "Prev" and "Next" navigation URLs
    const prevButtonUrl = $('.ch-prev-btn').attr('href') || null;
    const nextButtonUrl = $('.ch-next-btn').attr('href') || null;

    res.json({
      title,
      images,
      prevChapter,
      nextChapter,
      chapters,
      prevButtonUrl,
      nextButtonUrl
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
