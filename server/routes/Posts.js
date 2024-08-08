const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const listOfPosts = await Posts.findAll({ include: [Likes] });
        
        const updatedPosts = listOfPosts.map(post => {
            return {
                ...post.dataValues,
                isLiked: post.Likes.some(like => like.UserId === userId)
            };
        });

        res.json({ listOfPosts: updatedPosts, userId });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

router.get("/byId/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    try {
        const post = await Posts.findByPk(id, { include: [Likes] });
        res.json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ error: "Failed to fetch post" });
    }
});

router.post("/", validateToken, async (req, res) => {
    try {
        const post = req.body;
        await Posts.create(post);
        res.json(post);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Failed to create post" });
    }
});

module.exports = router;