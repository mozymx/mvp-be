const router = require("express").Router();
const belvo = require("belvo").default;

const client = new belvo(
  process.env.BELVO_ID,
  process.env.BELVO_PASSWORD,
  process.env.BELVO_URL
);

router.get("/", (req, res) => {
  res.status(200).json({ message: "Belvo router working..." });
});

module.exports = router;
