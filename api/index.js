const express = require("express");
const { getUserById } = require("../db/users");
const router = express.Router();
const { JWT_SECRET = "somecrazykeyhere" } = process.env;
const usersRouter = require("./users");

// GET /api/health
router.get('/health', async (req, res, next) => {
    try {
        const uptime = process.uptime();
        const { rows: [dbConnection] } = await client.query('SELECT NOW();');
        const currentTime = new Date();
        const lastRestart = new Intl.DateTimeFormat('en', { timeStyle: 'long', dateStyle: 'long', timeZone: "America/Los_Angeles" }).format(currentTime - (uptime * 1000));
        res.send({ message: 'healthy', uptime, dbConnection, currentTime, lastRestart });
    } catch (err) {
        next(err);
    }
});

// set `req.user` if possible
router.use(async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');

    if (!auth) { // nothing to see here
        next();
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length);

        try {
            const parsedToken = jwt.verify(token, JWT_SECRET);

            const id = parsedToken && parsedToken.id;
            if (id) {
                req.user = await getUserById(id);
                next();
            }
        } catch (error) {
            next(error);
        }
    } else {
        next({
            name: 'AuthorizationHeaderError',
            message: `Authorization token must start with ${prefix}`
        });
    }
});

router.use((req, res, next) => {
    if (req.user) {
        console.log("User is set:", req.user);
    }
    next();
});

router.use("/users", usersRouter);

// get request to /api
router.get("/", (req, res) => {
    res.send("hello from /api");
});

module.exports = router;