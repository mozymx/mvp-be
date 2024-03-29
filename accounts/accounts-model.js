const db = require("../database/dbConfig");

module.exports = {
  addAccount,
  getAccountByID,
  getAccountByFilter,
  deleteAccount,
};

// add account from a user's bank
function addAccount(accountData) {
  return db("account").insert(accountData).returning("id");
}

// get account by id
function getAccountByID(accountID) {
  return db("account").where({ id: accountID }).first();
}

// get account by filter
function getAccountByFilter(filter) {
  return db("account").where(filter).first();
}

// delete account for a customer
function deleteAccount(accountID) {
  return db("account").where({ id: accountID }).del();
}
