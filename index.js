const express = require("express");
const logger = require('./logger');

var cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

const dbClient = require("./db/client");
dbClient.connect();

var corsOptions = {
    origin: ["http://localhost", /\.onrender\.com$/],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true,
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

// Log all requests using logger
app.use((req, res, next) => {
    logger.info({
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        responseTime: Date.now() - req.startTime,
    });
    next();
});

app.use("/api", require("./api"));

app.use((error, req, res, next) => {
    logger.error("server error in processing the request", error);
    if (res.statusCode < 400) {
        res.status(500);
    }
    res.send({ error: error.message, name: error.name });
});

app.listen(PORT, () => {
    logger.info(`server alive on ${PORT}`);
});

