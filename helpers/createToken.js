const constants = require("./constants");
const jwt = require("jsonwebtoken");

module.exports = (customer) => {
    const payload = {
        subject: customer.customer_id,
        name: customer.name
    };

    const secret = constants.jwtSecret;

    const options = {
        expiresIn: "1d",
    };

    return jwt.sign(payload, secret, options);
}