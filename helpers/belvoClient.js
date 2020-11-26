const belvo = require("belvo").default;

const client = new belvo(
  process.env.BELVO_ID,
  process.env.BELVO_PASSWORD,
  process.env.BELVO_URL
);

module.exports = client;
