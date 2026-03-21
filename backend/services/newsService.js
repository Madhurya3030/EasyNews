const axios = require("axios");

const API_KEY = "63e7a9a1ea8c4993ab2244aab91dc2a3";

const fetchNews = async () => {
  const url = `https://newsapi.org/v2/everything?q=india&language=en&sortBy=publishedAt&apiKey=${API_KEY}`;

  const response = await axios.get(url);

  console.log("API Response:", response.data); // 👈 DEBUG

  return response.data.articles;
};

module.exports = fetchNews;