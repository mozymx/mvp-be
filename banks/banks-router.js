const router = require("express").Router();
const belvo = require("belvo").default;

const Banks = require("./banks-model");

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

// create link to bank account
router.post("/register-account/:customerID", (req, res) => {
    const bank = req.body.institution;
    const username = req.body.username;
    const password = req.body.password;
    const customerID = req.params.customerID;

    client.connect()
    .then(() => {
        client.links.register(bank, username, password)
        .then((belvoLink) => {
            const customerData = {
                name: belvoLink.institution,
                account: belvoLink.id,
                type: belvoLink.access_mode,
                status: belvoLink.status,
                customer_id: customerID
            }

            Banks.addBank(customerData)
            .then((response) => {
                res.status(201).end();
            })
            .catch((error) => {
                res.status(500).send({ error });
            })
        })
        .catch((error) => {
            res.status(500).send({ error });
        });
    });
})

module.exports = router;