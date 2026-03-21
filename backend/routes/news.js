const express = require("express");
const router = express.Router();
const fetchNews = require("../services/newsService");
const Article = require("../models/Article");

const categorizeArticle = (article) => {
  const text = (article.title + " " + article.description).toLowerCase();

  if (text.includes("stock") || text.includes("market")) return "Finance";
  if (text.includes("election") || text.includes("government")) return "Politics";
  if (text.includes("economy") || text.includes("inflation")) return "Economy";

  return "General";
};

// Populate DB from NewsAPI + upsert (no dupes)
router.get("/fetch-news", async (req, res) => {
  try {
    console.log("🌐 Fetching fresh news from NewsAPI...");
    const articles = await fetchNews();

    let savedCount = 0;
    for (let art of articles.slice(0, 20)) { // Limit 20
      const category = categorizeArticle(art);
      const doc = {
        title: art.title,
        description: art.description,
        content: art.content || art.description,
        url: art.url,
        image: art.urlToImage,
        category,
        publishedAt: art.publishedAt || new Date(),
      };

      // Upsert by URL (no dupes)
      const result = await Article.updateOne(
        { url: doc.url },
        { $set: doc },
        { upsert: true }
      );
      if (result.upsertedCount || result.modifiedCount) savedCount++;
    }

    const total = await Article.countDocuments();
    console.log(`✅ Saved ${savedCount} new articles. Total in DB: ${total}`);

    res.json({
      success: true,
      saved: savedCount,
      total,
      sample: (await Article.find().sort({publishedAt: -1}).limit(3)).map(a => ({title: a.title, category: a.category}))
    });
  } catch (error) {
    console.error("❌ News fetch error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Recent articles (frontend fallback)
router.get("/recent", async (req, res) => {
  try {
    const articles = await Article.find().sort({ publishedAt: -1 }).limit(20);
    res.json(articles);
  } catch (error) {
    console.error("Recent fetch error:", error);
    res.status(500).json({ error: "DB error" });
  }
});

module.exports = router;
