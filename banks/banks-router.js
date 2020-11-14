const router = require("express").Router();
const belvo = require("belvo").default;

const Banks = require("./banks-model");

const client = new belvo(
  process.env.BELVO_ID,
  process.env.BELVO_PASSWORD,
  process.env.BELVO_URL
);

// get all available banks from Belvo
router.get("/available-banks", (req, res) => {
  client.connect().then(() => {
    client.institutions
      .list()
      .then((institutions) => {
        const mexicoRetailBanks = institutions.filter((institution) => {
          if (
            institution.type === "bank" &&
            institution["country_code"] === "MX" &&
            institution.name.includes("mx_retail")
          ) {
            return institution;
          }
        });
        res.status(200).json(mexicoRetailBanks);
      })
      .catch((error) => {
        console.log("ERROR", error);
        res.status(401).json({ error });
      });
  });
});

// get all bank connections created through Belvo
router.get("/bank-connection", (req, res) => {
  client.connect().then(() => {
    client.links
      .list()
      .then((belvoLinks) => {
        res.status(200).json({ belvoLinks });
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  });
});

// connect user to bank through Belvo
router.post("/bank-connection/:customerID", (req, res) => {
  const customerID = req.params.customerID;
  const { institution, username, password, token } = req.body;

  client.connect().then(() => {
    client.links
      .register(institution, username, password)
      .then((belvoLink) => {
        const customerData = {
          name: belvoLink.institution,
          link: belvoLink.id,
          link_type: belvoLink.access_mode,
          link_status: belvoLink.status,
          customer_id: customerID,
        };

        Banks.addBank(customerData)
          .then((response) => {
            res.status(201).end();
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      })
      .catch((error) => {
        if (error.statusCode === 428) {
          const { session, link } = error.detail[0];
          client.connect().then(() => {
            client.links.resume(session, token, link).then((belvoLink) => {
              const customerData = {
                name: belvoLink.institution,
                link: belvoLink.id,
                link_type: belvoLink.access_mode,
                link_status: belvoLink.status,
                customer_id: customerID,
              };

              Banks.addBank(customerData)
                .then((response) => {
                  res.status(201).end();
                })
                .catch((error) => {
                  res.status(500).json({ error });
                });
            });
          });
        } else {
          res.status(500).json({ error });
        }
      });
  });
});

// delete a bank connection created through Belvo
router.delete("/bank-connection/:linkID", (req, res) => {
  const linkID = req.params.linkID;

  client.connect().then(() => {
    client.links
      .delete(linkID)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

// get user's accounts from bank
router.post("/bank-accounts/:bankID", (req, res) => {
  const bankID = req.params.bankID;

  Banks.getBankByID(bankID)
    .then((bankAccount) => {
      client.connect().then(() => {
        client.accounts
          .retrieve(bankAccount.account)
          .then((registeredAccounts) => {
            res.status(201).json({ registeredAccounts });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    })
    .catch((error) => {
      console.log("Error:", error);
    });
});

// get balance from a specific user bank account
router.post("/account-balance/:accountID", (req, res) => {
  const accountID = req.params.accountID;

  client.connect().then(() => {
    client.balances
      .retrieve("57324f8f-5488-46d2-9bd6-81ea300599b2", "2020-10-10", {
        account: "4509b7b8-c7a1-4a04-ba2d-0a3eb2d97370",
      })
      .then((accountBalance) => {
        res.status(201).json({ accountBalance });
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  });
});

// delete a specific bank account
router.delete("/delete-account/:bankID", (req, res) => {
  const bankID = req.params.bankID;

  Banks.getBankByID(bankID).then((bankAccount) => {
    // first delete from our database
    Banks.deleteBank(bankAccount.id).then((response) => {
      // then from Belvo API
      client.connect().then(() => {
        client.links
          .delete(bankAccount.account)
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
