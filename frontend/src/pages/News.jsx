import React from 'react';
import NewsCard from '../components/NewsCard';

const dummyNews = [
  {
    id: 1,
    title: "AI Breakthrough: Generative Models Reach New Heights",
    summary: "Researchers have announced a significant milestone in generative AI, enabling models to reason and create more cohesive narratives than ever before. This opens up new possibilities for automation and creativity across multiple industries.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
    category: "Technology"
  },
  {
    id: 2,
    title: "Global Markets Rally as Tech Stocks Surge",
    summary: "Major indices hit all-time highs today, driven by strong earnings from leading technology companies and optimistic economic forecasts for the upcoming quarter.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1000",
    category: "Finance"
  },
  {
    id: 3,
    title: "SpaceX Successfully Launches New Satellite Constellation",
    summary: "The latest mission adds another 60 satellites to the growing network, expanding global internet coverage to remote areas and pushing the boundaries of commercial spaceflight.",
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=1000",
    category: "Science"
  },
  {
    id: 4,
    title: "Revolutionary Solid-State Battery Powers EV for 1,000 Miles",
    summary: "A new breakthrough in battery technology has successfully powered an electric vehicle for over 1,000 miles on a single charge, potentially eliminating range anxiety forever.",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1000",
    category: "Automotive"
  },
  {
    id: 5,
    title: "Global Summit Agrees on Strict Carbon Emission Targets",
    summary: "Leaders from 195 nations have reached a historic agreement to dramatically cut carbon emissions by 2030, introducing penalties for non-compliance and massive green energy funds.",
    image: "https://images.unsplash.com/photo-1470071131384-001b85755b36?auto=format&fit=crop&q=80&w=1000",
    category: "Environment"
  }
];

export default function News() {
  return (
    <div className="w-full h-full bg-black overflow-y-scroll snap-y snap-mandatory no-scrollbar relative">
      {dummyNews.map((news) => (
        <NewsCard key={news.id} news={news} />
      ))}
    </div>
  );
}
