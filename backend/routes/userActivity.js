const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/auth");

// Track read
router.post("/read", protect, async (req, res) => {
  const articleId = req.body.articleId;
  const userId = req.user._id;

  await User.findByIdAndUpdate(userId, {
    $addToSet: { readHistory: articleId }
  });

  res.json({ message: "Read tracked" });
});

// Track like
router.post("/like", protect, async (req, res) => {
  const articleId = req.body.articleId;
  const userId = req.user._id;

  await User.findByIdAndUpdate(userId, {
    $addToSet: { likedArticles: articleId }
  });

  res.json({ message: "Liked tracked" });
});

// Track save
router.post("/save", protect, async (req, res) => {
  const articleId = req.body.articleId;
  const userId = req.user._id;

  await User.findByIdAndUpdate(userId, {
    $addToSet: { savedArticles: articleId }
  });

  res.json({ message: "Saved tracked" });
});

module.exports = router;
