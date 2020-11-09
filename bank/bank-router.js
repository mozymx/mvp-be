const router = require("express").Router();
const belvo = require("belvo").default;

const client = new belvo(
    process.env.BELVO_ID,
    process.env.BELVO_PASSWORD,
    process.env.BELVO_SANDBOX
)

// generate Belvo API access token
router.get("/belvo-access-token", (req, res) => {
    client.connect()
    .then(() => {
        client.widgetToken.create()
        .then((response) => {
            res.json(response);
        })
        .catch((error) => {
            res.status(500).send({ message: error.message });
        });
    });
})

module.exports = router;