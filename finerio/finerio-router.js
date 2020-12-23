const router = require("express").Router();
const axios = require("axios");

const finerio = require("../helpers/finerioClient");

router.get("/banks", async (req, res) => {
  finerio
    .get("/banks")
    .then((response) => {
      res.status(200).json({ banks: response.data });
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
