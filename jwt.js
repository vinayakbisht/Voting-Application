
const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token not found or malformed" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Unauthorized - Token missing" });

    try {
        const decodedUserData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedUserData;

        return next();
    } catch (err) {
        console.error("JWT verification error:", err.message);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

const generateToken = (userData) =>{
    return jwt.sign({userData}, process.env.JWT_SECRET);
}
module.exports = {jwtAuthMiddleware,generateToken};
