const db = require("../database/dbConfig");

module.exports = {
    addBenefits,
    findBenefitsByCustomer,
    updateBenefits
}

// add benefit for a customer
function addBenefits(customerID) {
    return db("benefit").insert({ customer_id: customerID }).returning("id");
}

// find benefits by customer id
function findBenefitsByCustomer(customerID) {
    return db("benefit").where({ customer_id: customerID }).first();
}

// update benefits for a customer
function updateBenefits(customerID, benefitUpdates) {
    return db("benefit")
    .where({ customer_id: customerID })
    .update(benefitUpdates);
}