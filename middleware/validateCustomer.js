const Customer = require("../auth/auth-model");

const validateCustomer = (req, res, next) => {
    const customer = req.body;

    Customer.findCustomerByFilter({ email: customer.email })
    .then((foundCustomer) => {
        if (foundCustomer.length == 0) {
            res.status(404).json({ error: `El correo '${customer.email}' no existe. Por favor regístralo o intenta de nuevo. :)`})
        } else {
            req.foundCustomer = foundCustomer[0];
            next();
        }
    })
    .catch((error) => {
        res.status(500).json({ error: error.message });
    })
}

module.exports = validateCustomer;