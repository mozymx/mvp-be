require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authenticate = require("./middleware/authenticate");
const authRouter = require("./auth/auth-router.js");
const benefitsRouter = require("./benefits/benefits-router.js");

const server = express();

server.use(cors());
server.use(helmet());
server.use(express.json());

server.get("/", (req, res) => {
    res.status(200).json({message: "Server is up and running."});
});

server.use("/mvp/auth", authRouter);
server.use("/mvp/benefits", authenticate, benefitsRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});