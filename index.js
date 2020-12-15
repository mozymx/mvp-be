require("dotenv").config();

const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const authenticateToken = require("./middleware/authenticateToken");
const accountsRouter = require("./accounts/accounts-router");
const banksRouter = require("./banks/banks-router.js");
const belvoRouter = require("./belvo/belvo-router");
const benefitsRouter = require("./benefits/benefits-router.js");
const customersRouter = require("./customers/customers-router.js");
const finerioRouter = require("./finerio/finerio-router");
const transactionsRouter = require("./transactions/transactions-router");

const server = express();

server.use(cors());
server.use(express.json());
server.use(helmet());
server.use(morgan("dev"));
server.use(bodyParser.urlencoded({ extended: true }));

server.get("/", (req, res) => {
  res.status(200).json({ message: "Server is up and running." });
});

server.use("/mvp/accounts", authenticateToken, accountsRouter);
server.use("/mvp/banks", authenticateToken, banksRouter);
server.use("/mvp/belvo", authenticateToken, belvoRouter);
server.use("/mvp/benefits", authenticateToken, benefitsRouter);
server.use("/mvp/customers", customersRouter);
server.use("/mvp/finerio", finerioRouter);
server.use("/mvp/transactions", authenticateToken, transactionsRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
