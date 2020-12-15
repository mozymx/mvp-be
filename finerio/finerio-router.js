const router = require("express").Router();
const axios = require("axios");
const qs = require("qs");

router.post("/", (req, res) => {
  const url = "https://api-v2-sandbox.finerio.mx/oauth/token";

  const credentials = Buffer.from(
    `${process.env.FINERIO_CLIENT_ID}:${process.env.FINERIO_CLIENT_SECRET}`
  ).toString("base64");

  const data = qs.stringify({
    username: process.env.FINERIO_USERNAME,
    password: process.env.FINERIO_PASSWORD,
    grant_type: "password",
  });

  const config = {
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  axios
    .post(url, data, config)
    .then((response) => {
      console.log("RESPONSE", response);
    })
    .catch((error) => {
      console.log("ERROR", error);
    });
});

// router.post("/", (req, res) => {
//   const username = "sspZwVXwUT25MnkpTmgaaPyl4ONVv17q61gw8ocOJz3NMIXAFs";
//   const password = "6M0qckKic6ElkeI7sswAWDiMjMUcWClTsFxxSfygFFG5LF2W1G";
//   const credentials = Buffer.from(`${username}:${password}`).toString("base64");

//   const data = {
//     username: "emilio@mozy.mx",
//     password: "wishful-living-DISARM-tope",
//     grant_type: "password",
//   };

//   axios
//     .post("https://api-v2-sandbox.finerio.mx/oauth/token", qs.stringify(data), {
//       headers: {
//         Authorization: `Basic ${credentials}`,
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     })
//     .then((response) => {
//       console.log("RESPONSE", response);
//     })
//     .catch((error) => {
//       console.log("ERROR", error);
//     });
// });

module.exports = router;
