const router = require("express").Router();
const belvo = require("belvo").default;

const Banks = require("./banks-model");

const client = new belvo(
    process.env.BELVO_ID,
    process.env.BELVO_PASSWORD,
    process.env.BELVO_URL
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
            res.status(500).json({ error });
        });
    });
});

// get all institutions from Belvo
router.get("/belvo-institutions", (req, res) => {
    client.connect()
    .then(() => {
        client.institutions.list()
        .then((institutions) => {
            const mexicoRetailBanks = institutions.filter((institution) => {
                if (institution.type === "bank" && institution["country_code"] === "MX" && institution.name.includes("mx_retail")) {
                    return institution
                }
            })
            res.status(200).json(mexicoRetailBanks);
        })
        .catch((error) => {
            console.log("ERROR", error);
            res.status(401).json({ error });
        });
    });
});

// get all bank account links
router.get("/bank-accounts", (req, res) => {
    Banks.getAllBanks()
    .then((bankAccounts) => {
        res.status(200).json({ bankAccounts });
    })
    .catch((error) => {
        res.status(500).json({ error });
    });
});

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
                res.status(500).json({ error });
            })
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
    });
});

// get bank accounts from a specific link
router.get("/something", (req, res) => {
    client.connect()
    .then(() => {
        client.accounts.list()
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
    });
});

// create banke account for a specific link
router.post("/something/:bankID", (req, res) => {
    const bankID = req.params.bankID;

    Banks.getBankByID(bankID)
    .then((bankAccount) => {
        console.log("Bank Account", bankAccount);
    })
    .catch((error) => {
        console.log("Error:", error);
    });
});

// delete a specific bank account
router.delete("/delete-account/:bankID", (req, res) => {
    const bankID = req.params.bankID;

    Banks.getBankByID(bankID)
    .then((bankAccount) => {
        // first delete from our database
        Banks.deleteBank(bankAccount.id)
        .then((response) => {
            // then from Belvo API
            client.connect()
            .then(() => {
                client.links.delete(bankAccount.account)
                .then((response) => {
                    res.status(204).end();
                })
                .catch((error) => {
                    res.status(500).json({ error });
                });
            });
        });
    });
});

module.exports = router;