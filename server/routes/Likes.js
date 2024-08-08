const express = require("express");
const router = express.Router();
const { Likes, Posts } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/", validateToken, async (req, res) => {
    const { PostId } = req.body;
    const UserId = req.user.id;

    const found = await Likes.findOne({ where: { PostId, UserId } });

    if (found) {
        await Likes.destroy({ where: { PostId, UserId } });
        const updatedPost = await Posts.findOne({ 
            where: { id: PostId },
            include: [Likes] 
        });
        res.json({ liked: false, likes: updatedPost.Likes });
    } else {
        await Likes.create({ PostId, UserId });
        const updatedPost = await Posts.findOne({ 
            where: { id: PostId },
            include: [Likes] 
        });
        res.json({ liked: true, likes: updatedPost.Likes });
    }
});

module.exports = router;
