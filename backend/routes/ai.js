const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const axios = require("axios");
const cheerio = require("cheerio");


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function getArticleContent(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let text = "";

    $("p").each((i, el) => {
      text += $(el).text() + " ";
    });

    return text.trim();

  } catch (err) {
    console.error("❌ Scraping failed:", err.message);
    return "";
  }
}


// 🔥 Summarize News
router.post("/summarize", async (req, res) => {
  try {
    const { title, description, content, url } = req.body;

    let finalContent = content || description;

    // ✅ Fetch full article if URL exists
    if (url) {
      const scrapedContent = await getArticleContent(url);

      if (scrapedContent && scrapedContent.length > 200) {
        finalContent = scrapedContent;
      }
    }

    const prompt = `
Summarize this news article strictly based on given information.

Return 3 short bullet points.

Title: ${title || ""}
Description: ${description || ""}
Content: ${finalContent || ""}
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }]
    });

    const summary = response.choices[0]?.message?.content;

    res.json({ summary });

  } catch (error) {
    console.error("❌ Groq error:", error);
    res.status(500).json({ error: "AI failed" });
  }
});


router.post("/translate", async (req, res) => {
  try {
    const { text, targetLang } = req.body;

    const prompt = `
Translate the following text into ${targetLang}.
Keep it natural.

Text:
${text}
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }]
    });

    res.json({
      translated: response.choices[0]?.message?.content
    });

  } catch (err) {
    console.error("❌ Translate error:", err);
    res.status(500).json({ error: "Translation failed" });
  }
});


router.post("/smart", async (req, res) => {
  try {
    const { article, mode } = req.body;

    let prompt = "";

    if (mode === "explain") {
      prompt = `
Explain this news in very simple terms so a beginner can understand.

News:
${article}
`;
    }

    else if (mode === "future") {
      prompt = `
Based on this news, predict what might happen next.

Give 3 possible outcomes in bullet points.

News:
${article}
`;
    }

    else if (mode === "keypoints") {
      prompt = `
Extract the most important key points from this news.

Return 4 short bullet points.

News:
${article}
`;
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }]
    });

    res.json({
      result: response.choices[0]?.message?.content
    });

  } catch (err) {
    console.error("❌ Smart AI error:", err);
    res.status(500).json({ error: "AI failed" });
  }
});


// 🔥 Ask Question about Article
router.post("/ask", async (req, res) => {
  try {
    const { question, article } = req.body;

    const prompt = `
Based on this news article:

${article}

Answer this question:
${question}
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "user", content: prompt }
      ]
    });

    const answer = response.choices[0]?.message?.content;

    res.json({ answer });

  } catch (error) {
    console.error("❌ Groq error:", error);
    res.status(500).json({ error: "AI failed" });
  }
});

module.exports = router;