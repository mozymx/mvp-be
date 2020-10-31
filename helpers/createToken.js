const constants = require("./constants");
const jwt = require("jsonwebtoken");

module.exports = (user) => {
    const payload = {
        subject: user.id,
        name: user.name
    };

    const secret = constants.jwtSecret;

    const options = {
        expiresIn: "1d",
    };

    return jwt.sign(payload, secret, options);
}