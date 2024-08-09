const express = require("express");
const router = express.Router();
const { Comment } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

// Fetch comments by postId
router.get("/:postId", async (req, res) => {
    const postId = req.params.postId;
    try {
      const comments = await Comment.findAll({ where: { postId: postId } });
      if (comments) {
        res.json(comments);
      } else {
        res.status(404).json({ error: "No comments found for this post" });
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });  

// Add a comment
router.post("/", validateToken, async (req, res) => {
    const comment = req.body;
    const username = req.user.username;
    comment.username = username;
    await Comment.create(comment);
    res.json(comment);
});

// Delete a comment
router.delete('/:commentId', validateToken, async (req, res) => {
    const commentId = req.params.commentId;
    console.log(`Delete request received for comment ID: ${commentId}`);

    // Check if commentId is actually being logged
    if (!commentId) {
        return res.status(400).json({ error: "Comment ID not provided" });
    }
    
    try {
        const result = await Comment.destroy({
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