const router = require("express").Router();
const client = require("../helpers/belvoClient");
const { DateTime } = require("luxon");

const Accounts = require("../accounts/accounts-model");
const Banks = require("../banks/banks-model");

// current time minus 30 days
const oneMonthAgo = DateTime.local().minus({ days: 30 }).toISODate();

// get 30 days of transactions from a user's bank account
router.post("/bank/:bankID/account/:accountID", (req, res) => {
  const bankID = req.params.bankID;
  const accountID = req.params.accountID;

  Banks.getBankByID(bankID)
    .then((bank) => {
      Accounts.getAccountByID(accountID)
        .then((account) => {
          client
            .connect()
            .then(() => {
              client.transactions
                .retrieve(bank.link, oneMonthAgo, {
                  account: account.number,
                  saveData: false,
                })
                .then((customerTransactions) => {
                  res.status(201).json({ customerTransactions });
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

module.exports = router;
