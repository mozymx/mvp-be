const router = require("express").Router();
const bcryptjs = require("bcryptjs");

const Customers = require("./auth-model");
const Benefits = require("../benefits/benefits-model");
const Banks = require("../banks/banks-model");
const Accounts = require("../banks/accounts-model");

const verifyRequirements = require("../middleware/verifyRequirements");
const validateCustomer = require("../middleware/validateCustomer");
const createToken = require("../helpers/createToken");
const errorMessages = require("../helpers/errorMessages");

// register new customer
router.post("/register", verifyRequirements, (req, res) => {
  const customer = req.body;

  // hash the password
  const rounds = 8;
  const hash = bcryptjs.hashSync(customer.password, rounds);

  customer.password = hash;

  // save customer to database
  Customers.addCustomer(customer)
    .then((customer) => {
      const token = createToken(customer);
      const customerID = customer[0];

      // create default benefits for customer
      Benefits.addBenefits(customerID)
        .then((benefit) => {
          res.status(201).json({
            message: "Register successful.",
            customerID,
            token,
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: `There was an error adding default benefits for customerID ${customerID}. Try again.`,
          });
        });
    })
    .catch((error) => {
      const errorMessage = errorMessages(error);
      if (errorMessage) {
        res.status(409).json({ error: errorMessage });
      } else {
        res.status(500).json({
          error: `Hubo un error registrando a ${customer.name}. Por favor intenta de nuevo.`,
        });
      }
    });
});

// login existing customer
router.post("/login", validateCustomer, (req, res) => {
  const customer = req.body;
  const existingCustomer = req.foundCustomer;

  if (bcryptjs.compareSync(customer.password, existingCustomer.password)) {
    const token = createToken(existingCustomer);

    Banks.getBankByFilter({ customer_id: existingCustomer.id }).then((bank) => {
      if (bank) {
        Accounts.getAccountByFilter({ bank_id: bank.id }).then((account) => {
          if (account) {
            res.status(200).json({
              message: "Login successful.",
              customerID: existingCustomer.id,
              token,
              accountID: account.id,
            });
          } else {
            res.status(200).json({
              message: "Login successful.",
              customerID: existingCustomer.id,
              token,
              accountID: null,
            });
          }
        });
      } else {
        res.status(200).json({
          message: "Login successful.",
          customerID: existingCustomer.id,
          token,
          accountID: null,
        });
      }
    });
  } else {
    res.status(401).json({
      error: "Oops, contraseña equivocada. Por favor intenta de nuevo. :)",
    });
  }
});

module.exports = router;
