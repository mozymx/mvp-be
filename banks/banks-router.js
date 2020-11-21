const router = require("express").Router();
const belvo = require("belvo").default;

const Banks = require("./banks-model");
const Accounts = require("./accounts-model");

const client = new belvo(
  process.env.BELVO_ID,
  process.env.BELVO_PASSWORD,
  process.env.BELVO_URL
);

/* BANK CONNECTIONS (Belvo Links) */

// connect user to bank through Belvo
router.post("/bank-connection/:customerID", (req, res) => {
  const customerID = req.params.customerID;
  const { display_name, name, username, password, token } = req.body;

  // first create the link in Belvo
  client.connect().then(() => {
    client.links
      .register(name, username, password)
      .then((belvoLink) => {
        const customerData = {
          name: display_name,
          description: belvoLink.institution,
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
                name: display_name,
                description: belvoLink.institution,
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

  Banks.getBankByID(bankID).then((bank) => {
    // first delete from our database
    Banks.deleteBank(bank.id).then((response) => {
      // then from Belvo API
      client.connect().then(() => {
        client.links
          .delete(bank.link)
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
    .then((bank) => {
      client.connect().then(() => {
        client.accounts
          .retrieve(bank.link)
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
      res.status(500).json({ error });
    });
});

// get details from specific user bank account
router.get("/account-details/:accountID/bank/:bankID", (req, res) => {
  const accountID = req.params.accountID;
  const bankID = req.params.bankID;

  Banks.getBankByID(bankID)
    .then((bank) => {
      Accounts.getAccountByID(accountID).then((account) => {
        client
          .connect()
          .then(() => {
            client.accounts
              .detail(account.number)
              .then((accountDetails) => {
                // adds bank name to accountDetails
                // before sending it back in response
                accountDetails.bank_display_name = bank.name;
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
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

/* BANK TRANSACTIONS (Belvo Transactions) */
router.post("/bank-transactions/:accountID", (req, res) => {
  const accountID = req.params.accountID;

  // TODO:
  Accounts.getAccountsByID(accountID).then(account);
});

module.exports = router;
