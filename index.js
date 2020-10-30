require("dotenv").config();

const express = require("express");

const server = express();
server.use(express.json());

server.get("/", (req, res) => {
    res.status(200).json({message: "Server is up and running."});
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});