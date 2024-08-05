const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

// Fetch comments by postId
router.get("/:postId", async (req, res) => {
    const postId = req.params.postId;
    const comments = await Comments.findAll({ where: { postId: postId } });
    res.json(comments);
});

// Add a comment
router.post("/", validateToken, async (req, res) => {
    const comment = req.body;
    const username = req.user.username;
    comment.username = username;
    await Comments.create(comment);
    res.json(comment);
});

// Delete a comment
router.delete('/:commentId', validateToken, async (req, res) => {
    const commentId = req.params.commentId;
    console.log(`Delete request received for comment ID: ${commentId}`);
    try {
        const result = await Comments.destroy({
            where: {
                id: commentId,
            },
        });
        if (result === 0) {
            res.status(404).json({ error: "Comment not found" });
        } else {
            res.json("DELETED SUCCESSFULLY");
        }
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ error: "An error occurred while deleting the comment" });
    }
});

module.exports = router;