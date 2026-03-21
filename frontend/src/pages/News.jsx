import React, { useEffect, useState } from 'react';
import NewsCard from '../components/NewsCard';
import { useAuth } from '../context/AuthContext';

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    // Load recent articles immediately (guest mode)
    fetchRecentArticles();
  }, []);

  const fetchRecentArticles = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/news/recent');
      if (!res.ok) throw new Error('Recent fetch failed');
      const data = await res.json();
      console.log("✅ Recent Articles:", data);
      const formatted = data.map((item, index) => ({
        id: index,
        articleId: item._id,
        title: item.title,
        summary: item.description,
        image: item.image || '/vite.svg',
        category: item.category,
        url: item.url
      }));
      setArticles(formatted);
    } catch (err) {
      console.error("❌ Recent error:", err);
      setError('No articles available. Try populating DB.');
    } finally {
      setLoading(false);
    }
  };

  // Load personalized if user logged in
  useEffect(() => {
    if (!user?._id) return;

    fetch(`http://localhost:5000/api/recommend`, {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error(`Recommend ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("✅ Personalized:", data);
        if (data.length > 0) {
          const formatted = data.map((item, index) => ({
            id: index,
            articleId: item._id,
            title: item.title,
            summary: item.description,
            image: item.image,
            category: item.category,
            url: item.url
          }));
          setArticles(formatted);
        }
      })
      .catch(err => console.error("Personalized fallback:", err));
  }, [user?._id]);

  if (loading) return <div className="flex items-center justify-center h-screen text-white text-xl">Loading news...</div>;
  if (error) return <div className="text-red-400 text-center mt-20 p-8 bg-red-500/10 rounded">{error}</div>;
  if (articles.length === 0) return <div className="text-gray-400 text-center mt-20">No news. <a href="http://localhost:5000/api/news/fetch-news" className="underline">Populate DB</a></div>;

  return (
    <div className="w-full h-full bg-black overflow-y-scroll snap-y snap-mandatory no-scrollbar relative">
      {articles.map((news) => (
        <NewsCard key={news.id} news={news} userId={user?._id} />
      ))}
    </div>
  );
}

