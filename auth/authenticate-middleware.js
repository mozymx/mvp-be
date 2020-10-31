/* check if the user is logged in before granting access to the next middleware/route handler */

const jwt = require("jsonwebtoken");
const constants = require("../helpers/constants");

const validateUser = (req, res, next) => {
    if (!req.body.email) {
        res.status(400).json({ message: "Please add an email :)"});
    } else if (!req.body.password) {
        res.status(400).json({ message: "Don't forget your password :)"});
    } else {
        next();
    }
}

const authenticate = (req, res, next) => {
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

module.exports = {
    validateUser,
    authenticate
}