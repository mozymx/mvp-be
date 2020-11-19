const db = require("../database/dbConfig");

module.exports = {
  addAccount,
  getAccountByID,
};

// add account from a user's bank
function addAccount(accountData) {
  return db("account").insert(accountData).returning("id");
}

// get account by filter
function getAccountByID(accountID) {
  return db("account").where({ id: accountID }).first();
}
