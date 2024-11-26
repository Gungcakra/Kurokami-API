import express from "express";
import {
  getManhwaPopular,
  getManhwaRecommendation,
  getManhwaNew,
  getManhwaTop,
  getGenres,
  getGenreId,
  getGenreIdPage,
  getSearch,
  getSearchPage,
  getManhwaDetail,
  getManhwaOnGoing,
  getChapter,
} from "../controllers/scrapingController.js";

const router = express.Router();

router.get("/manhwa-popular", getManhwaPopular);
router.get("/manhwa-recommendation", getManhwaRecommendation);
router.get("/manhwa-new", getManhwaNew);
router.get("/manhwa-top", getManhwaTop);
router.get("/genres", getGenres);
router.get("/genre/:genreId", getGenreId);
router.get("/genre/:genreId/page/:pageNumber", getGenreIdPage);
router.get("/search/:searchId", getSearch);
router.get("/search/:searchId/page/:pageNumber", getSearchPage);
router.get("/manhwa-detail/:manhwaId", getManhwaDetail);
router.get("/manhwa-ongoing", getManhwaOnGoing);
router.get("/chapter/:chapterId", getChapter);

export default router;
