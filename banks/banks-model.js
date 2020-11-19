const db = require("../database/dbConfig");

module.exports = {
  addBank,
  getAllBanks,
  getBankByID,
  deleteBank,
};

// add bank for a customer
function addBank(customerData) {
  return db("bank").insert(customerData).returning("id");
}

// get all banks
function getAllBanks() {
  return db("bank");
}

// get bank by filter
function getBankByID(bankID) {
  return db("bank").where({ id: bankID }).first();
}

// delete bank for a customer
function deleteBank(bankID) {
  return db("bank").where({ id: bankID }).del();
}
