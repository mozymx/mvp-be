const router = require("express").Router();
const client = require("../helpers/belvoClient");

const Accounts = require("../accounts/accounts-model");
const Banks = require("./banks-model");

// connect user to bank through Belvo
router.post("/customer/:customerID", (req, res) => {
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
        } else if (
          error.statusCode === 400 &&
          error.detail[0].code === "login_error"
        ) {
          res.status(400).json({
            error:
              "Usuario o contraseña equivocada. Por favor intenta de nuevo. :)",
          });
        } else {
          res.status(500).json({ error });
        }
      });
  });
});

// get details from specific user bank account
router.get("/bank/:bankID/account/:accountID", (req, res) => {
  const bankID = req.params.bankID;
  const accountID = req.params.accountID;

  Banks.getBankByID(bankID)
    .then((bank) => {
      Accounts.getAccountByID(accountID)
        .then((account) => {
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
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

// delete a specific bank connection
router.delete("/bank/:bankID", (req, res) => {
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

module.exports = router;
