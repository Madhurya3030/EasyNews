import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaHeart, FaRegHeart, 
  FaThumbsDown, FaRegThumbsDown, 
  FaComment, FaRegComment, 
  FaRobot, FaGlobe, FaShare, 
  FaBookmark, FaRegBookmark 
} from 'react-icons/fa';

export default function NewsCard({ news }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  return (
    <div className="w-full h-full snap-start relative bg-black shrink-0 flex justify-center items-center overflow-hidden">
      {/* Background Image Setup */}
      <img 
        src={news.image} 
        alt={news.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark gradient overlay to make text readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90" />

      {/* Main Content Animation Wrapper */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.8 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute inset-0 flex flex-col justify-end p-4 md:p-8 pb-8 md:pb-12"
      >
        
        {/* Right Side Action Panel */}
        <div className="absolute right-4 bottom-24 md:bottom-32 flex flex-col items-center gap-6 z-10">
          <button onClick={handleLike} className="flex flex-col items-center group">
            <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
              {liked ? <FaHeart className="text-red-500 text-2xl" /> : <FaRegHeart className="text-white text-2xl" />}
            </div>
            <span className="text-white text-xs mt-1 font-medium text-shadow">12k</span>
          </button>
          
          <button onClick={handleDislike} className="flex flex-col items-center group">
            <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
              {disliked ? <FaThumbsDown className="text-blue-500 text-2xl" /> : <FaRegThumbsDown className="text-white text-2xl" />}
            </div>
            <span className="text-white text-xs mt-1 font-medium text-shadow">Dislike</span>
          </button>

          <button className="flex flex-col items-center group">
            <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
              <FaComment className="text-white text-2xl" />
            </div>
            <span className="text-white text-xs mt-1 font-medium text-shadow">842</span>
          </button>

          <button className="flex flex-col items-center group">
            <div className="w-12 h-12 bg-purple-600/50 backdrop-blur-md rounded-full flex items-center justify-center transition-transform group-hover:scale-110 border border-purple-400/30">
              <FaRobot className="text-purple-200 text-2xl" />
            </div>
            <span className="text-purple-200 text-xs mt-1 font-medium text-shadow">AI Tools</span>
          </button>

          <button className="flex flex-col items-center group">
            <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
              <FaGlobe className="text-white text-2xl" />
            </div>
            <span className="text-white text-xs mt-1 font-medium text-shadow">Translate</span>
          </button>

          <button className="flex flex-col items-center group">
            <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
              <FaShare className="text-white text-2xl" />
            </div>
            <span className="text-white text-xs mt-1 font-medium text-shadow">Share</span>
          </button>
        </div>

        {/* Bottom Content Area */}
        <div className="w-[85%] md:w-[75%] pr-4 relative z-10">
          <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold mb-3 border border-white/30">
            {news.category}
          </div>
          
          <h2 className="text-white text-2xl md:text-4xl font-bold mb-3 leading-tight drop-shadow-lg">
            {news.title}
          </h2>
          
          <p className="text-zinc-200 text-sm md:text-base line-clamp-3 md:line-clamp-none drop-shadow-md">
            {news.summary}
          </p>

          <div className="mt-4 flex items-center">
            <button 
              onClick={() => setSaved(!saved)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md transition-colors border ${
                saved 
                  ? 'bg-white text-black border-white hover:bg-zinc-200' 
                  : 'bg-black/50 text-white border-white/30 hover:bg-black/70'
              }`}
            >
              {saved ? <FaBookmark /> : <FaRegBookmark />}
              <span className="font-semibold text-sm">{saved ? 'Saved' : 'Save for later'}</span>
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}