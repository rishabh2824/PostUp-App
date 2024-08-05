const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    console.log("Authorization Header received:", authHeader);

    if (!authHeader) {
        console.log("No authorization header provided");
        return res.status(403).json({ error: "User not logged in" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token extracted:", token);

    if (!token) {
        console.log("No token provided");
        return res.status(403).json({ error: "User not logged in" });
    }

    try {
        const validToken = verify(token, "importantsecret");
        req.user = validToken;
        console.log("Valid Token:", validToken);

        if (validToken) {
            return next();
        }
    } catch (err) {
        console.log("Token validation error:", err.message);
        return res.status(403).json({ error: "Token is not valid" });
    }
};

module.exports = { validateToken };
