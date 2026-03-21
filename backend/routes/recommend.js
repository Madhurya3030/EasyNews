const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Article = require("../models/Article");

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    const articles = await Article.find({
      category: { $in: user.interests }
    });

    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

module.exports = router;