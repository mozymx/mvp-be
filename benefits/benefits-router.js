const router = require("express").Router();

const Benefits = require("./benefits-model");

// get benefits by customer id
router.get("/customer/:customerID", (req, res) => {
  const customerID = req.params.customerID;

  Benefits.findBenefitsByCustomer(customerID)
    .then((benefits) => {
      res.status(200).json({ customerBenefits: benefits });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// update benefits for a customer
router.put("/customer/:customerID", (req, res) => {
  const customerID = req.params.customerID;
  const benefitUpdates = req.body;

  Benefits.updateBenefits(customerID, benefitUpdates)
    .then((updateCount) => {
      res.status(204).end();
    })
    .catch((error) => {
      res.status(500).json({
        error: `There was an error updating customer ${customerID}'s benefits. Try again.`,
      });
    });
});

module.exports = router;
