import { load } from "cheerio";
import { fetchPage } from "../utils/fetchPage.js";

export const getManhwaPopular = async (req, res) => {
  try {
    const url = "https://komikstation.co/manga/?type=manhwa&order=popular";

    const html = await fetchPage(url);

    const $ = load(html);

    const results = [];

    $(".bs").each((index, element) => {
      const title = $(element).find(".tt").text().trim();
      const chapter = $(element).find(".epxs").text().trim();
      const rating = $(element).find(".numscore").text().trim();
      const imageSrc = $(element).find("img").attr("src");
      const link = $(element).find("a").attr("href");

      results.push({
        title,
        chapter,
        rating,
        imageSrc,
        link,
      });
    });

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while scraping data");
  }
};

export const getManhwaRecommendation = async (req, res) => {
  try {
    const urls = [
      "https://komikstation.co/manga/?page=2&type=manhwa&order=popular",
      "https://komikstation.co/manga/?page=3&type=manhwa&order=popular",
    ];

    const allResults = [];

    for (const url of urls) {
      const html = await fetchPage(url);

      const $ = load(html);

      $(".bs").each((index, element) => {
        const title = $(element).find(".tt").text().trim();
        const chapter = $(element).find(".epxs").text().trim();
        const rating = $(element).find(".numscore").text().trim();
        const imageSrc = $(element).find("img").attr("src");
        const link = $(element).find("a").attr("href");

        allResults.push({
          title,
          chapter,
          rating,
          imageSrc,
          link,
        });
      });
    }

    res.json(allResults);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while scraping data");
  }
};

export const getManhwaNew = async (req, res) => {
  try {
    const url = "https://komikstation.co/";
    const html = await fetchPage(url);
    const $ = load(html);

    const results = [];

    $(".utao").each((index, element) => {
      const title = $(element).find(".luf h4").text().trim();
      const link = $(element).find(".luf a.series").attr("href");
      const imageSrc = $(element).find(".imgu img").attr("src");
      const chapters = [];

      const mangaList = $(element).find(".luf ul.Manga li");
      const manhwaList = $(element).find(".luf ul.Manhwa li");
      const manhuaList = $(element).find(".luf ul.Manhua li");
      const chapterElements = mangaList.length
        ? mangaList
        : manhwaList.length
        ? manhwaList
        : manhuaList;

      chapterElements.each((i, el) => {
        const chapterLink = $(el).find("a").attr("href");
        const chapterTitle = $(el).find("a").text().trim();
        const timeAgo = $(el).find("span").text().trim();

        chapters.push({
          chapterLink,
          chapterTitle,
          timeAgo,
        });
      });

      results.push({
        title,
        link,
        imageSrc,
        chapters,
      });
    });

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while scraping data");
  }
};

export const getManhwaTop = async (req, res) => {
  const url = "https://komikstation.co/";

  try {
    const html = await fetchPage(url);
    const $ = load(html);
    const recommendations = [];

    $(".serieslist.pop.wpop.wpop-weekly ul li").each((index, element) => {
      const item = {};
      const img = $(element).find(".imgseries img");

      item.rank = $(element).find(".ctr").text().trim();
      item.title = $(element).find(".leftseries h2 a").text().trim();
      item.url = $(element).find(".leftseries h2 a").attr("href");
      item.image = img.attr("src");
      item.genres = $(element)
        .find(".leftseries span")
        .text()
        .replace("Genres: ", "")
        .split(", ");
      item.rating = $(element).find(".numscore").text().trim();

      recommendations.push(item);
    });

    res.json(recommendations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

export const getGenres = async (req, res) => {
  try {
    const url = "https://komikstation.co/manga/list-mode/";
    const html = await fetchPage(url);
    const $ = load(html);

    const genres = [];

    $(".dropdown-menu.c4.genrez li").each((index, element) => {
      const genreLabel = $(element).find("label").text().trim();
      const genreValue = $(element).find("input").val();

      if (genreLabel && genreValue) {
        genres.push({ label: genreLabel, value: genreValue });
      }
    });

    res.json({ genres });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

export const getGenreId = async (req, res) => {
  const { genreId } = req.params;
  const url = `https://komikstation.co/genres/${genreId}`;

  try {
    const html = await fetchPage(url);
    const $ = load(html);
    const seriesList = [];

    $(".bs").each((index, element) => {
      const series = {};
      const bsx = $(element).find(".bsx");

      series.title = bsx.find("a").attr("title");
      series.url = bsx.find("a").attr("href");
      series.image = bsx.find("img").attr("src");
      series.latestChapter = bsx.find(".epxs").text();
      series.rating = bsx.find(".numscore").text();

      seriesList.push(series);
    });

    const pagination = [];
    $(".pagination a.page-numbers").each((index, element) => {
      const pageUrl = $(element).attr("href");
      const pageNumber = $(element).text();
      pagination.push({ pageUrl, pageNumber });
    });

    const nextPage = $(".pagination a.next.page-numbers").attr("href");

    res.json({ seriesList, pagination, nextPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

export const getGenreIdPage = async (req, res) => {
  const { genreId, pageNumber } = req.params;
  const url = `https://komikstation.co/genres/${genreId}/page/${pageNumber}`;

  try {
    const html = await fetchPage(url);
    const $ = load(html);
    const seriesList = [];

    $(".bs").each((index, element) => {
      const series = {};
      const bsx = $(element).find(".bsx");

      series.title = bsx.find("a").attr("title");
      series.url = bsx.find("a").attr("href");
      series.image = bsx.find("img").attr("src");
      series.latestChapter = bsx.find(".epxs").text();
      series.rating = bsx.find(".numscore").text();

      seriesList.push(series);
    });

    const pagination = [];
    $(".pagination a.page-numbers").each((index, element) => {
      const pageText = $(element).text().trim().toLowerCase();

      if (pageText !== "« sebelumnya" && pageText !== "berikutnya »") {
        const pageUrl = $(element).attr("href");
        const pageNumber = $(element).text();
        pagination.push({ pageUrl, pageNumber });
      }
    });

    res.json({ seriesList, pagination });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

export const getSearch = async (req, res) => {
  const { searchId } = req.params;
  const url = `https://komikstation.co/?s=${searchId}`;

  try {
    const html = await fetchPage(url);
    const $ = load(html);
    const seriesList = [];

    $(".bs").each((index, element) => {
      const series = {};
      const bsx = $(element).find(".bsx");

      series.title = bsx.find("a").attr("title");
      series.url = bsx.find("a").attr("href");
      series.image = bsx.find("img").attr("src");
      series.latestChapter = bsx.find(".epxs").text();
      series.rating = bsx.find(".numscore").text();

      seriesList.push(series);
    });

    const pagination = [];
    $(".pagination a.page-numbers").each((index, element) => {
      const pageUrl = $(element).attr("href");
      const pageNumber = $(element).text();
      pagination.push({ pageUrl, pageNumber });
    });

    const nextPage = $(".pagination a.next.page-numbers").attr("href");

    res.json({ seriesList, pagination, nextPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

export const getSearchPage = async (req, res) => {
  const { searchId, pageNumber } = req.params;
  const url = `https://komikstation.co/page/${pageNumber}/?s=${searchId}`;

  try {
    const html = await fetchPage(url);
    const $ = load(html);
    const seriesList = [];

    $(".bs").each((index, element) => {
      const series = {};
      const bsx = $(element).find(".bsx");

      series.title = bsx.find("a").attr("title");
      series.url = bsx.find("a").attr("href");
      series.image = bsx.find("img").attr("src");
      series.latestChapter = bsx.find(".epxs").text();
      series.rating = bsx.find(".numscore").text();

      seriesList.push(series);
    });

    const pagination = [];
    $(".pagination a.page-numbers").each((index, element) => {
      const pageText = $(element).text().trim().toLowerCase();

      if (pageText !== "« sebelumnya" && pageText !== "berikutnya »") {
        const pageUrl = $(element).attr("href");
        const pageNumber = $(element).text();
        pagination.push({ pageUrl, pageNumber });
      }
    });

    res.json({ seriesList, pagination });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

export const getManhwaDetail = async (req, res) => {
  const manhwaId = req.params.manhwaId;
  const url = `https://komikstation.co/manga/${manhwaId}`;

  try {
    const html = await fetchPage(url);
    const $ = load(html);

    const title = $(".infox .entry-title").text().trim();
    const imageSrc = $(".thumb img").attr("src");
    const rating = $(".rating .num").text().trim();
    const followedBy = $(".bmc").text().trim();

    const synopsis = $(".entry-content.entry-content-single").text().trim();

    const firstChapterLink = $(".lastend .inepcx")
      .first()
      .find("a")
      .attr("href");
    const firstChapterTitle = $(".lastend .inepcx")
      .first()
      .find(".epcurfirst")
      .text()
      .trim();
    const latestChapterLink = $(".lastend .inepcx")
      .last()
      .find("a")
      .attr("href");
    const latestChapterTitle = $(".lastend .inepcx")
      .last()
      .find(".epcurlast")
      .text()
      .trim();

    const status = $(".tsinfo .imptdt").eq(0).find("i").text().trim();
    const type = $(".tsinfo .imptdt").eq(1).find("a").text().trim();
    const released = $(".fmed").eq(0).find("span").text().trim();
    const author = $(".fmed").eq(1).find("span").text().trim();
    const artist = $(".fmed").eq(2).find("span").text().trim();
    const updatedOn = $(".fmed").eq(3).find("time").text().trim();

    const genres = [];
    $(".mgen a").each((index, element) => {
      const genreName = $(element).text().trim();
      const genreLink = $(element).attr("href");
      genres.push({
        genreName,
        genreLink,
      });
    });

    const chapters = [];
    $("#chapterlist li").each((index, element) => {
      const chapterNum = $(element).find(".chapternum").text().trim();
      const chapterLink = $(element).find(".eph-num a").attr("href");
      const chapterDate = $(element).find(".chapterdate").text().trim();
      const downloadLink = $(element).find(".dload").attr("href");

      chapters.push({
        chapterNum,
        chapterLink,
        chapterDate,
        downloadLink,
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
        link: firstChapterLink,
      },
      latestChapter: {
        title: latestChapterTitle,
        link: latestChapterLink,
      },
      status,
      type,
      released,
      author,
      artist,
      updatedOn,
      genres,
      chapters,
    };

    res.json(manhwaDetails);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while scraping data");
  }
};

export const getManhwaOnGoing = async (req, res) => {
    const url = "https://komikstation.co/manga/?status=ongoing&type=manhwa&order=";
  try {
    const html = await fetchPage(url);
    const $ = load(html);

    const manhwaList = [];

    $(".bs").each((index, element) => {
      const title = $(element).find(".bigor .tt").text().trim();
      const imageUrl = $(element).find("img").attr("src");
      const link = $(element).find("a").attr("href");
      const latestChapter = $(element).find(".epxs").text().trim();
      const rating = $(element).find(".numscore").text().trim();

      manhwaList.push({
        title,
        imageUrl,
        link,
        latestChapter,
        rating,
      });
    });

    res.send(manhwaList);
  } catch (error) {
    res.status(500).send({
      message: "Gagal mengambil data manhwa ongoing.",
      error: error.message,
    });
  }
};

export const getChapter = async (req, res) => {
  const { chapterId } = req.params;
  const url = `https://komikstation.co/${chapterId}`; 

  try {
    const html = await fetchPage(url);
    const $ = load(html);

    
    const title = $("h1.entry-title").text().trim();

    
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    
    await delay(250);

    
    const scriptContent = $("script")
      .filter((i, el) => {
        return $(el).html().includes("ts_reader.run");
      })
      .html();

      
    const jsonString = scriptContent.match(/ts_reader\.run\((.*?)\);/)[1];
    const jsonObject = JSON.parse(jsonString);

    
    const images = jsonObject.sources[0].images;

    
    const prevChapter = jsonObject.prevUrl || null;
    const nextChapter = jsonObject.nextUrl || null;

    
    const chapters = [];
    $(".nvx #chapter option").each((index, element) => {
      const chapterTitle = $(element).text().trim();
      const chapterUrl = $(element).attr("value") || null;

      chapters.push({
        title: chapterTitle,
        url: chapterUrl,
      });
    });

    
    const prevButtonUrl = $(".ch-prev-btn").attr("href") || null;
    const nextButtonUrl = $(".ch-next-btn").attr("href") || null;

    res.json({
      title,
      images,
      prevChapter,
      nextChapter,
      chapters,
      prevButtonUrl,
      nextButtonUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch chapter data" });
  }
};
