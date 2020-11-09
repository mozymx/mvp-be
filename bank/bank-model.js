const db = require("../database/dbConfig");

module.exports = {
    addBank,
}

// add bank for a customer
function addBank(customerID) {
    return db("bank").insert({ customer_id: customerID }).returning("id");
}