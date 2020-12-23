const router = require("express").Router();
const finerio = require("../helpers/finerioClient");

router.get("/banks", (req, res) => {
  finerio
    .get("/banks")
    .then((response) => {
      res.status(200).json({ banks: response.data });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/banks/:bankID", (req, res) => {
  const bankID = req.params.bankID;

  finerio
    .get(`/banks/${bankID}/fields`)
    .then((response) => {
      res.status(200).json({ bankDetails: response.data });
    })
    .catch((error) => {
      console.log(error);
    });
});

// create a customer
router.post("/customers", (req, res) => {
  const customerID = req.body.customerID;

  const newCustomer = {
    name: customerID,
  };

  finerio
    .post("customers", newCustomer)
    .then((response) => {
      res.status(201).json({ newCustomer: response.data });
    })
    .catch((error) => {
      res.status(400).json({ error: error.response.data.errors[0] });
    });
});

// get all customers
router.get("/customers", (req, res) => {
  finerio
    .get("/customers")
    .then((response) => {
      res.status(200).json({ finerioCustomers: response.data.data });
    })
    .catch((error) => {
      res.status(400).json({ error: error.response.data.errors });
    });
});

// delete a customer
router.delete("/customers/:customerID", (req, res) => {
  const customerID = req.params.customerID;

  finerio
    .delete(`/customers/${customerID}`)
    .then((response) => {
      res.status(204).end();
    })
    .catch((error) => {
      res.status(400).json({ error: error.response.data.errors });
    });
});

module.exports = router;
