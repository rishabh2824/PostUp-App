const express = require("express");
const router = express.Router();
const { Like, Post } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/", validateToken, async (req, res) => {
    const { postId } = req.body;
    const userId = req.user.id;

    const found = await Like.findOne({ where: { postId, userId } });

    if (found) {
        await Like.destroy({ where: { postId, userId } });
        const updatedPost = await Post.findOne({ 
            where: { id: postId },
            include: [Like] 
        });
        res.json({ liked: false, likes: updatedPost.Likes });
    } else {
        await Like.create({ postId, userId });
        const updatedPost = await Post.findOne({ 
            where: { id: postId },
            include: [Like] 
        });
        res.json({ liked: true, likes: updatedPost.Likes });
    }
});

module.exports = router;