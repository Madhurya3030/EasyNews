import React, { useState, useEffect } from 'react';
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
const [likeCount, setLikeCount] = useState(news?.likeCount || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
const [commentText, setCommentText] = useState("");
const [copied, setCopied] = useState(false);

  // const userId = "69be294c60564a42b2e1a733"; // ✅ your user id


const handleCommentSubmit = async () => {
  if (!commentText.trim()) return;

  try {
    await fetch("http://localhost:5000/api/activity/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        articleId: news.articleId,
        commentText: commentText,
         title: news.title,
  description: news.description,
  image: news.image,
  url: news.url
      }),
    });

    setCommentText(""); // clear input
    setCommentCount(prev => prev + 1); // 🔥 instant update

  } catch (err) {
    console.error("Comment error:", err);
  }
};


const handleShare = async (e) => {
  e.stopPropagation();

  const appUrl = `http://localhost:3000/article/${news.articleId}`;

  const shareData = {
    title: news.title,
    text: news.summary,
    url: appUrl
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(appUrl);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  } catch (err) {
    console.error("Share failed:", err);
  }
};

  // 🔥 TRACK READ
 const handleRead = () => {
  if (!userId) return;

  fetch("http://localhost:5000/api/activity/read", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ 
  articleId: news.articleId,
  userId: userId,
  title: news.title,
  description: news.description,
  image: news.image,
  url: news.url
}),
  });

  window.open(news.url, "_blank");
 };

  // Initialize like state and count
  useEffect(() => {
    const initLikes = async () => {
      if (!userId || !news.articleId) return;
      
      try {
        const [statusRes, countRes] = await Promise.all([
          fetch(`http://localhost:5000/api/activity/like/${news.articleId }/status`, {
            credentials: 'include'
          }),
          fetch(`http://localhost:5000/api/activity/like/${news.articleId }/count`, {      credentials: 'include'     })     ]);
        
        if (statusRes.ok) {
          const { liked } = await statusRes.json();
          setLiked(liked);
        }
        
        if (countRes.ok) {
          const { count } = await countRes.json();
          setLikeCount(count);
        }
      } catch (error) {
        console.error('Failed to init like state:', error);
      }
    };
    
    initLikes();
  }, [userId, news?.articleId]);

useEffect(() => {
  setLikeCount(news?.likeCount || 0);
}, [news]);

useEffect(() => {
  const fetchCommentCount = async () => {
    if (!news.articleId) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/activity/comment/${news.articleId}/count`
      );

      const data = await res.json();

      setCommentCount(prev => prev + 1);

    } catch (err) {
      console.error("Comment count error:", err);
    }
  };

  fetchCommentCount();
}, [news.articleId]);



// 🔥 TRACK LIKE
     const handleLike = async (e) => {
  e.stopPropagation();
  console.log("USER ID:", userId);
console.log("ARTICLE ID:", news.articleId );
  if (!userId || isLoading) return;

  setIsLoading(true);

  const newLiked = !liked;
  const delta = newLiked ? 1 : -1;

  // Optimistic UI
  setLiked(newLiked);
  setLikeCount(prev => Math.max(0, prev + delta));

  try {
    const response = await fetch("http://localhost:5000/api/activity/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ 
  articleId: news.articleId,
  userId: userId,
    title: news.title,
  description: news.description,
  image: news.image,
  url: news.url
})
    });

    if (!response.ok) throw new Error("Toggle failed");

    // Fetch real count
    const countRes = await fetch(
      `http://localhost:5000/api/activity/like/${news.articleId }/count`,
      { credentials: "include" }
    );

    const data = await countRes.json();
    setLikeCount(data.count);

  } catch (error) {
    // Rollback
    setLiked(!newLiked);
    setLikeCount(prev => Math.max(0, prev - delta));
    console.error("Like error:", error);
  } finally {
    setIsLoading(false);
  }
};

// 🔥 TRACK DISLIKE
  const handleDislike = (e) => {
    e.stopPropagation();

    setDisliked(!disliked);
    if (liked) {
  setLiked(false);
  setLikeCount(prev => Math.max(0, prev - 1)); // 🔥 ADD THIS
}

    fetch("http://localhost:5000/api/activity/dislike", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
       articleId: news.articleId
      }),

    });
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
      credentials: "include",
    body: JSON.stringify({
      articleId: news.articleId,
       title: news.title,
  description: news.description,
  image: news.image,
  url: news.url
    }),
  });
  };

return (
  <>
    <div 
      onClick={handleRead}
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
          
          {/* LIKE */}
          <button 
            onClick={handleLike} 
            disabled={isLoading}
            className="flex flex-col items-center group disabled:opacity-50"
          >
            <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center group-hover:scale-110">
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : liked ? (
                <FaHeart className="text-red-500 text-2xl" />
              ) : (
                <FaRegHeart className="text-white text-2xl" />
              )}
            </div>
            <span className="text-white text-xs mt-1">
              {likeCount.toLocaleString()}
            </span>
          </button>

          {/* DISLIKE */}
          <button 
            onClick={handleDislike} 
            className="flex flex-col items-center group"
          >
            <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center group-hover:scale-110">
              {disliked 
                ? <FaThumbsDown className="text-blue-500 text-2xl" /> 
                : <FaRegThumbsDown className="text-white text-2xl" />}
            </div>
            <span className="text-white text-xs mt-1">Dislike</span>
          </button>

          {/* COMMENT */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowComments(true);
            }}
            className="flex flex-col items-center group"
          >
            <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center group-hover:scale-110">
              <FaComment className="text-white text-2xl" />
            </div>
            <span className="text-white text-xs mt-1">
              {commentCount.toLocaleString()}
            </span>
          </button>

          {/* AI */}
          <button className="flex flex-col items-center group">
            <div className="w-12 h-12 bg-purple-600/50 rounded-full flex items-center justify-center group-hover:scale-110">
              <FaRobot className="text-purple-200 text-2xl" />
            </div>
            <span className="text-purple-200 text-xs mt-1">AI</span>
          </button>

          {/* TRANSLATE */}
          <button className="flex flex-col items-center group">
            <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center group-hover:scale-110">
              <FaGlobe className="text-white text-2xl" />
            </div>
            <span className="text-white text-xs mt-1">Translate</span>
          </button>

          {/* SHARE */}
         <button 
  onClick={handleShare}
  className="flex flex-col items-center group"
>
  <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center group-hover:scale-110">
    <FaShare className="text-white text-2xl" />
  </div>
  <span className="text-green-400 text-xs mt-1">
  {copied ? "Copied!" : "Share"}
</span>
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
            <button 
              onClick={handleSave}
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

    {/* COMMENT MODAL */}
    {showComments && (
  <div 
    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    onClick={() => setShowComments(false)}
  >
    <div 
      className="w-[90%] max-w-md bg-zinc-900 rounded-2xl p-4 shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      
      {/* Header */}
      <h3 className="text-white text-lg font-semibold mb-3 text-center">
        Comments
      </h3>

      {/* Input Section */}
      <div className="flex gap-2">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 bg-black/50 text-white px-3 py-2 rounded-lg outline-none text-sm"
        />

        <button
          onClick={handleCommentSubmit}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white text-sm"
        >
          Send
        </button>
      </div>

    </div>
  </div>
)}
  </>
);
}