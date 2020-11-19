const router = require("express").Router();
const belvo = require("belvo").default;

const Banks = require("./banks-model");
const Accounts = require("./accounts-model");

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

/* BANK CONNECTIONS (Belvo Links) */

// connect user to bank through Belvo
router.post("/bank-connection/:customerID", (req, res) => {
  const customerID = req.params.customerID;
  const { institution, username, password, token, access_mode } = req.body;

  // first create the link in Belvo
  client.connect().then(() => {
    client.links
      .register(institution, username, password, { access_mode: access_mode })
      .then((belvoLink) => {
        const customerData = {
          name: belvoLink.institution,
          link: belvoLink.id,
          link_type: belvoLink.access_mode,
          link_status: belvoLink.status,
          customer_id: customerID,
        };

        // second add it to our database
        Banks.addBank(customerData)
          .then((bankIDs) => {
            const bankID = bankIDs[0];
            res.status(201).json({ bankID });
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
                .then((bankIDs) => {
                  const bankID = bankIDs[0];
                  res.status(201).json({ bankID });
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

// delete a specific bank connection
router.delete("/bank-connection/:bankID", (req, res) => {
  const bankID = req.params.bankID;

  Banks.getBankByID(bankID).then((bankAccount) => {
    // first delete from our database
    Banks.deleteBank(bankAccount.id).then((response) => {
      // then from Belvo API
      client.connect().then(() => {
        client.links
          .delete(bankAccount.link)
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

/* BANK ACCOUNTS (Belvo Accounts) */

// get user's accounts from bank
router.post("/bank-accounts/:bankID", (req, res) => {
  const bankID = req.params.bankID;

  Banks.getBankByID(bankID)
    .then((bankAccount) => {
      client.connect().then(() => {
        client.accounts
          .retrieve(bankAccount.link)
          .then((registeredAccounts) => {
            res.status(201).json({ registeredAccounts });
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

// save user's bank account
router.post("/save-bank-account/:bankID", (req, res) => {
  const bankID = req.params.bankID;
  const accountData = {
    name: req.body.name,
    number: req.body.id,
    type: req.body.type,
    category: req.body.category,
    currency: req.body.currency,
    bank_id: bankID,
  };

  Accounts.addAccount(accountData)
    .then((accountIDs) => {
      const accountID = accountIDs[0];
      res.status(201).json({ accountID });
    })
    .catch((error) => {
      res.statusÇ(500).json({ error });
    });
});

// get details from specific user bank account
router.get("/account-details/:accountID", (req, res) => {
  const accountID = req.params.accountID;

  Accounts.getAccountByID(accountID).then((account) => {
    client
      .connect()
      .then(() => {
        client.accounts
          .detail(account.number)
          .then((accountDetails) => {
            res.status(200).json({ accountDetails });
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  });
});

/* BANK TRANSACTIONS (Belvo Transactions) */
router.post("/bank-transactions/:accountID", (req, res) => {
  const accountID = req.params.accountID;

  // TODO:
  Accounts.getAccountsByID(accountID).then(account);
});

/* HELPER ENDPOINTS THAT SKIP OUR DATABASE
AND DEAL WITH BELVO DIRECTLY */

// get all bank connections created through Belvo
router.get("/belvo-links", (req, res) => {
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

// delete a bank connection created through Belvo
router.delete("/belvo-links/:linkID", (req, res) => {
  const linkID = req.params.linkID;

  client.connect().then(() => {
    client.links
      .delete(linkID)
      .then((response) => {
        res.status(204).end();
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  });
});

// get all bank accounts created through Belvo
router.get("/belvo-accounts", (req, res) => {
  client.connect().then(() => {
    client.accounts
      .list()
      .then((belvoAccounts) => {
        res.status(200).json({ belvoAccounts });
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  });
});

// delete a bank connection created through Belvo
router.delete("/belvo-accounts/:accountID", (req, res) => {
  const accountID = req.params.accountID;

  client.connect().then(() => {
    client.accounts
      .delete(accountID)
      .then((response) => {
        res.status(204).end();
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  });
});

module.exports = router;
