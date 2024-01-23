const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

const dbClient = require("./db/client");
dbClient.connect();


app.use(bodyParser.json());

app.use("/api", require("./api"));

app.use((error, req, res, next) => {
    console.error("server error in processing the request", error);
    if (res.statusCode < 400) {
        res.status(500);
    }
    res.send({ error: error.message, name: error.name });
});

app.listen(PORT, () => {
    console.log(`server alive on ${PORT}`);
});

