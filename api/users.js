const express = require("express");
const router = express.Router();
const { getUser, getUserByUsername, createUser } = require("../db/users");
const jwt = require("jsonwebtoken");
const { JWT_SECRET = "somecrazykeyhere" } = process.env;

// /api/users
router.get("/", (req, res) => {
    res.send("hello from /api/users");
});

// POST /api/users/login
router.post("/login", async (req, res, next) => {
    //get username and password from request
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            next({
                name: "MissingCredentialsError",
                message: "Please supply both a username and a password!"
            });
        }
        const user = await getUser({ username, password });
        if (!user) {
            next({
                name: "InvalidCredentialsError",
                message: "Please supply a valid combination for username/password!"
            });
        }
        else {
            //generate token here
            const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "1w" });
            res.send({ user, message: "logged in successfully", token });
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
});

// POST /api/users/register
router.post("/register", async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            next({
                name: "MissingCredentialsError",
                message: "Please supply both a username and a password!"
            });
        }
        const queriedUser = await getUserByUsername(username);
        if (queriedUser) {
            res.status(401);
            next({
                name: "UserAlreadyExistsError",
                message: "Cannot have 2 users with the same username!"
            });
        }
        else if (password.length < 8) {
            res.status(401);
            next({
                name: "PasswordLengthError",
                message: "Password should be at least 8 characters long!"
            });
        }
        else {
            //save the recordin the database here
            const user = await createUser({ username, password });
            if (user) {
                const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "1w" });
                res.send({ user: user, message: "User registered successfully", token });
            }
            else {
                res.status(401);
                next({
                    name: "UserRegistrationError",
                    message: "Unknown error registering the user!"
                });
            }
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
});
module.exports = router;