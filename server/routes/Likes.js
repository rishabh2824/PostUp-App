const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/", validateToken, async (req, res) => {
    const { PostId } = req.body;
    const UserId = req.user.id;

    const found = await Likes.findOne({ where: { PostId, UserId } });

    if (found) {
        await Likes.destroy({ where: { PostId, UserId } });
        res.json({ liked: false });
    } else {
        await Likes.create({ PostId, UserId });
        res.json({ liked: true });
    }
});

module.exports = router;