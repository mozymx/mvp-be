const db = require("../database/dbConfig");

module.exports = {
    addBank,
}

// add bank for a customer
function addBank(customerData) {
    return db("bank").insert(customerData).returning("id");
}