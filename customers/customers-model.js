const db = require("../database/dbConfig");

module.exports = {
  addCustomer,
  findCustomerByID,
  findCustomerByFilter,
};

// add customer and return it
function addCustomer(customer) {
  return db("customer").insert(customer).returning("id");
}

// find customer by id
function findCustomerByID(customerID) {
  return db("customer").where({ id: customerID }).first();
}

// find customer by other criteria
function findCustomerByFilter(filter) {
  return db("customer").where(filter).orderBy("id");
}
