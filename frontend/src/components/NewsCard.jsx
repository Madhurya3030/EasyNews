import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaHeart, FaRegHeart, 
  FaThumbsDown, FaRegThumbsDown, 
  FaComment, 
  FaRobot, FaGlobe, FaShare, 
  FaBookmark, FaRegBookmark 
} from 'react-icons/fa';

export default function NewsCard({ news, userId }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [saved, setSaved] = useState(false);

  // const userId = "69be294c60564a42b2e1a733"; // ✅ your user id

  // 🔥 TRACK READ
 const handleRead = () => {
  if (!userId) return;

  fetch("http://localhost:5000/api/activity/read", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      articleId: news.articleId
    }),
  });

  window.open(news.url, "_blank");
};

  // 🔥 TRACK LIKE
  const handleLike = (e) => {
    e.stopPropagation();

    setLiked(!liked);
    if (disliked) setDisliked(false);

    fetch("http://localhost:5000/api/activity/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        articleId: news.articleId
      }),
    });
  };

  // 🔥 TRACK DISLIKE (optional UI only)
  const handleDislike = (e) => {
    e.stopPropagation();

    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  // 🔥 TRACK SAVE
  const handleSave = (e) => {
    e.stopPropagation();

    setSaved(!saved);

    fetch("http://localhost:5000/api/activity/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        articleId: news.articleId
      }),
    });
  };

  return (
    <div 
      onClick={handleRead} // ✅ TRACK READ HERE
      className="w-full h-full snap-start relative bg-black shrink-0 flex justify-center items-center overflow-hidden cursor-pointer"
    >
      
      {/* Background Image */}
      <img 
        src={news.image || "https://via.placeholder.com/500"} 
        alt={news.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90" />

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.8 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 flex flex-col justify-end p-4 md:p-8 pb-8 md:pb-12"
      >
        
        {/* Right Panel */}
        <div className="absolute right-4 bottom-24 md:bottom-32 flex flex-col items-center gap-6 z-10">
          
          <button onClick={handleLike} className="flex flex-col items-center group">
            <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center group-hover:scale-110">
              {liked ? <FaHeart className="text-red-500 text-2xl" /> : <FaRegHeart className="text-white text-2xl" />}
            </div>
            <span className="text-white text-xs mt-1">12k</span>
          </button>
          
          <button onClick={handleDislike} className="flex flex-col items-center group">
            <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center group-hover:scale-110">
              {disliked ? <FaThumbsDown className="text-blue-500 text-2xl" /> : <FaRegThumbsDown className="text-white text-2xl" />}
            </div>
            <span className="text-white text-xs mt-1">Dislike</span>
          </button>

          <button className="flex flex-col items-center group">
            <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center group-hover:scale-110">
              <FaComment className="text-white text-2xl" />
            </div>
            <span className="text-white text-xs mt-1">842</span>
          </button>

          <button className="flex flex-col items-center group">
            <div className="w-12 h-12 bg-purple-600/50 rounded-full flex items-center justify-center group-hover:scale-110">
              <FaRobot className="text-purple-200 text-2xl" />
            </div>
            <span className="text-purple-200 text-xs mt-1">AI</span>
          </button>

          <button className="flex flex-col items-center group">
            <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center group-hover:scale-110">
              <FaGlobe className="text-white text-2xl" />
            </div>
            <span className="text-white text-xs mt-1">Translate</span>
          </button>

          <button className="flex flex-col items-center group">
            <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center group-hover:scale-110">
              <FaShare className="text-white text-2xl" />
            </div>
            <span className="text-white text-xs mt-1">Share</span>
          </button>
        </div>

        {/* Bottom Content */}
        <div className="w-[85%] md:w-[75%] pr-4 relative z-10">
          
          <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-xs mb-3">
            {news.category || "General"}
          </div>
          
          <h2 className="text-white text-2xl md:text-4xl font-bold mb-3">
            {news.title}
          </h2>
          
          <p className="text-zinc-200 text-sm md:text-base">
            {news.summary || "No description available"}
          </p>

          {/* Prevent double click */}
          <a 
            href={news.url} 
            target="_blank" 
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-3 inline-block text-blue-400 underline text-sm"
          >
            Read Full Article
          </a>

          <div className="mt-4 flex items-center">
            <button onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                saved 
                  ? 'bg-white text-black' 
                  : 'bg-black/50 text-white'
              }`}
            >
              {saved ? <FaBookmark /> : <FaRegBookmark />}
              <span className="text-sm">
                {saved ? 'Saved' : 'Save'}
              </span>
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}