const router = require("express").Router();
const client = require("../helpers/belvoClient");

const Accounts = require("./accounts-model");
const Banks = require("../banks/banks-model");

// get user's accounts from bank
router.post("/bank/:bankID", (req, res) => {
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

module.exports = router;
