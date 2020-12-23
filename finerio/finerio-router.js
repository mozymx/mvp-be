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

router.get("/banks/:bankID/", (req, res) => {
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

module.exports = router;
