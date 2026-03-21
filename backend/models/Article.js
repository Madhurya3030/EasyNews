const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true },
  description: { type: String, required: [true, 'Description is required'], trim: true },
  content: { type: String, default: '' },
  url: { type: String, required: [true, 'URL is required'], unique: true, trim: true },
  image: { type: String, default: '' },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    enum: {
      values: ['Finance', 'Politics', 'Economy', 'General'],
      message: 'Category must be Finance, Politics, Economy, or General'
    }
  },
  publishedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for performance
articleSchema.index({ category: 1 });
articleSchema.index({ publishedAt: -1 });
articleSchema.index({ title: 'text', description: 'text', content: 'text' });

module.exports = mongoose.model("Article", articleSchema);
