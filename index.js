require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { authenticate } = require("./auth/authenticate-middleware");
const authRouter = require("./auth/auth-router.js");

const server = express();

server.use(cors());
server.use(helmet());
server.use(express.json());

server.get("/", (req, res) => {
    res.status(200).json({message: "Server is up and running."});
});

server.use("/mvp/auth", authRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});