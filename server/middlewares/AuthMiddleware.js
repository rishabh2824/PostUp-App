const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(403).json({ error: "User not logged in - Authorization issue" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(403).json({ error: "User not logged in - No token issue" });
    }

    try {
        const validToken = verify(token, "importantsecret");
        req.user = validToken;

        if (validToken) {
            return next();
        }

    } catch (err) {
        return res.status(403).json({ error: err });
    }
};

module.exports = { validateToken };