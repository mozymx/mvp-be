const router = require("express").Router();
const bcryptjs = require("bcryptjs");

const Customer = require("./auth-model");
const Benefit = require("../benefits/benefits-model");

const createToken = require("../helpers/createToken");
const validateNewCustomer = require("../middleware/validateNewCustomer");
const validateExistingCustomer = require("../middleware/validateExistingCustomer");

// register new customer
router.post("/register", validateNewCustomer, (req, res) => {
    const customer = req.body;

    // hash the password
    const rounds = 8;
    const hash = bcryptjs.hashSync(customer.password, rounds);

    customer.password = hash;

    // save customer to database
    Customer.addCustomer(customer)
    .then((customer) => {
        const token = createToken(customer);
        const customerID = customer[0]

        // create default benefits for customer
        Benefit.addBenefit(customerID)
        .then((benefit) => {
            res.status(201).json({
                message: "Register successful.",
                customerID,
                token
            });
        })
        .catch((error) => {
            res.status(500).json({ error: `There was an error adding default benefits for customerID ${customerID}. Try again.`})
        })
    })
    .catch((error) => {
        res.status(500).json({ error: `There was an error creating a user for ${customer.name}. Try again.` });
    });
});

// login existing customer
router.post("/login", validateExistingCustomer, (req, res) => {
    const customer = req.body;

    Customer.findCustomerByFilter({ email: customer.email })
    .then((customers) => {
        const foundCustomer = customers[0];

        if (customer && bcryptjs.compareSync(customer.password, foundCustomer.password)) {
            const token = createToken(foundCustomer);

            res.status(200).json({
                message: "Login successful.",
                customerID: foundCustomer.customer_id,
                token,
            });
        } else {
            res.status(401).json({ message: "Sorry, your token is invalid."});
        }
    })
    .catch((error) => {
        res.status(500).json({ error: "Sorry, wrong email or password. Try again." });
    });
});

module.exports = router;