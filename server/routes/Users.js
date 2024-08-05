const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middlewares/AuthMiddleware");

// Register user
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const userExists = await Users.findOne({ where: { username } });
        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hash = await bcrypt.hash(password, 10);
        await Users.create({
            username: username,
            password: hash,
        });

        res.json("SUCCESS");
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Login user
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await Users.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ error: "User doesn't exist" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: "Wrong username and password combination" });
        }

        const accessToken = sign(
            { username: user.username, id: user.id },
            "importantsecret"
        );

        res.json({ token: accessToken, username: username, id: user.id });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Authenticate user
router.get("/auth", validateToken, (req, res) => {
    res.json(req.user);
});

module.exports = router;