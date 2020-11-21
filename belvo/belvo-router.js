const router = require("express").Router();
const belvo = require("belvo").default;

const client = new belvo(
  process.env.BELVO_ID,
  process.env.BELVO_PASSWORD,
  process.env.BELVO_URL
);

// get all available banks from Belvo
router.get("/available-banks", (req, res) => {
  client.connect().then(() => {
    client.institutions
      .list()
      .then((institutions) => {
        const mexicoRetailBanks = institutions.filter((institution) => {
          if (
            institution.type === "bank" &&
            institution["country_code"] === "MX" &&
            institution.name.includes("mx_retail")
          ) {
            return institution;
          }
        });
        res.status(200).json(mexicoRetailBanks);
      })
      .catch((error) => {
        console.log("ERROR", error);
        res.status(401).json({ error });
      });
  });
});

module.exports = router;
