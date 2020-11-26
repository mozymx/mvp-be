const verifyRequirements = (req, res, next) => {
    if (!req.body.name) {
        res.status(400).json({ message: "What's your name?" });
    } else if (!req.body.email) {
        res.status(400).json({ message: "What's your email?"});
    } else if (!req.body.phone) {
        res.status(400).json({ message: "What's your phone number?" });
    } else if (!req.body.password) {
        res.status(400).json({ message: "Please add a password."});
    } else {
        next();
    }
}

module.exports = verifyRequirements;