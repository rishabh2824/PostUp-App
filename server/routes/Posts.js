const express = require("express");
const router = express.Router();
const { Post, Like } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const listOfPosts = await Post.findAll({ include: [Like] });

        const updatedPosts = listOfPosts.map(post => {
            return {
                ...post.dataValues,
                isLiked: post.Likes.some(like => like.userId === userId)
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
        const post = await Post.findByPk(id, { include: [Like] });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ error: "Failed to fetch post" });
    }
});

router.get("/byuserId/:id", async (req, res) => {
    const id = req.params.id;
    const listOfPosts = await Post.findAll({
        where: { userId: id },
        include: [Like], 
    });
    res.json(listOfPosts);
});


router.post("/", validateToken, async (req, res) => {
    try {
        const post = req.body;
        post.userId = req.user.id;
        const newPost = await Post.create(post);
        res.json(newPost);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Failed to create post" });
    }
});

router.delete("/:postId", validateToken, async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.id;

    try {
        // Find the post by its ID
        const post = await Post.findOne({ where: { id: postId } });

        // Check if the post exists and if the user is authorized to delete it
        if (post && post.userId === userId) {
            await Post.destroy({ where: { id: postId } });
            res.json("Post deleted successfully.");
        } else {
            res.status(403).json({ error: "You are not authorized to delete this post." });
        }
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Failed to delete post." });
    }
});

module.exports = router;