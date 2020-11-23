/* HELPER ENDPOINTS THAT SKIP OUR DATABASE
AND DEAL WITH BELVO DIRECTLY */

const router = require("express").Router();
const client = require("../helpers/belvoClient");

// get all retail banks from Mexico
router.get("/institutions", (req, res) => {
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
        res.status(200).json({ institutions: mexicoRetailBanks });
      })
      .catch((error) => {
        res.status(401).json({ error });
      });
  });
});

// get all bank connections
router.get("/links", (req, res) => {
  client.connect().then(() => {
    client.links
      .list()
      .then((links) => {
        res.status(200).json({ links });
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  });
});

// delete a bank connection
router.delete("/links/:linkID", (req, res) => {
  const linkID = req.params.linkID;

  client.connect().then(() => {
    client.links
      .delete(linkID)
      .then((response) => {
        res.status(204).end();
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  });
});

// get all bank accounts
router.get("/accounts", (req, res) => {
  client.connect().then(() => {
    client.accounts
      .list()
      .then((accounts) => {
        res.status(200).json({ accounts });
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  });
});

// delete a bank connection
router.delete("/accounts/:accountID", (req, res) => {
  const accountID = req.params.accountID;

  client.connect().then(() => {
    client.accounts
      .delete(accountID)
      .then((response) => {
        res.status(204).end();
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  });
});

module.exports = router;
