require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authenticateToken = require("./middleware/authenticateToken");
const authRouter = require("./auth/auth-router.js");
const benefitsRouter = require("./benefits/benefits-router.js");
const bankRouter = require("./bank/bank-router.js");

const server = express();

server.use(cors());
server.use(helmet());
server.use(express.json());

server.get("/", (req, res) => {
    res.status(200).json({message: "Server is up and running."});
});

server.use("/mvp/auth", authRouter);
server.use("/mvp/benefits", authenticateToken, benefitsRouter);
server.use("/mvp/bank", authenticateToken, bankRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});