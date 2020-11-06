const router = require("express").Router();

const Benefit = require("./benefits-model");


// get benefits by customer id
router.get("/:customerID", (req, res) => {
    const customerID = req.params.customerID;

    Benefit.findBenefitsByCustomer(customerID)
    .then((benefits) => {
        res.status(200).json({ customerBenefits: benefits })
    })
    .catch((error) => {
        res.status(500).json({ error: error.message });
    });
});

// update benefits for a customer
router.put("/:customerID", (req, res) => {
    const customerID = req.params.customerID;
    const benefitUpdates = req.body;

    Benefit.updateBenefits(customerID, benefitUpdates)
    .then((updateCount) => {
        res.status(204).end();
    })
    .catch((error) => {
        res.status(500).json({ error: `There was an error updating customer ${customerID}'s benefits. Try again.`})
    })

})

module.exports = router;