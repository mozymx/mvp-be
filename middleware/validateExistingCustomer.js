const validateExistingCustomer = (req, res, next) => {
    if (!req.body.email) {
        res.status(400).json({ message: "Please add an email :)"});
    } else if (!req.body.password) {
        res.status(400).json({ message: "Don't forget your password :)"});
    } else {
        next();
    }
}

module.exports = validateExistingCustomer;