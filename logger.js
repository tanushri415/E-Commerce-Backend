const winston = require('winston');
const { combine, timestamp, errors, json } = winston.format;

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        errors({ stack: true }),
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }), json()
    ),
    transports: [new winston.transports.Console()],
}, { exitOnError: false });

module.exports = logger;