const jwt = require("jsonwebtoken");
const constants = require("../helpers/constants");

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, constants.jwtSecret, (error, decodedToken) => {
            if (error) {
                // token was modified or expired
                res.status(401).json({ message: "Sorry, you're not authorized to use our API."});
            } else {
                req.decodedToken = decodedToken;
                next();
            }
        });
    } else {
        res.status(401).json({ error: "Please provide the necessary credentials."});
    }
};

module.exports = authenticateToken;