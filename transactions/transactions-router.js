const router = require("express").Router();
const client = require("../helpers/belvoClient");

const Accounts = require("../accounts/accounts-model");
const Banks = require("../banks/banks-model");

router.get("/", (req, res) => {
  res.status(200).json({ message: "Transactions router is up..." });
});

module.exports = router;
