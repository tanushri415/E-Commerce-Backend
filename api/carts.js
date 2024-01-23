const express = require("express");
const router = express.Router();
const { getUserCarts } = require("../db/users");


// /api/carts
router.get("/", (req, res) => {
    res.send("hello from /api/carts");
});

// /api/carts/:userId
router.get('/user/:userId', async (req, res) => {
    console.log(req.params.userId);
    const cart = await getUserCarts(req.params.userId);
    res.send(cart);
});

module.exports = router;