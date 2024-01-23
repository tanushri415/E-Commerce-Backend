const { use } = require("../api");
const client = require("./client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

// create a user in the DB 
async function createUser({ username, password }) {
    const hashedPwd = await bcrypt.hash(password, SALT_COUNT);
    try {
        const { rows: [user] } = await client.query(`
        INSERT INTO users(username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING RETURNING id, username`, [username, hashedPwd]);
        delete user.password;
        return user;
    } catch (error) {
        throw (error);
    }
}

// get user by username
async function getUserByUsername(username) {
    try {
        const { rows } = await client.query(`
        SELECT * FROM users WHERE username=$1`, [username]);
        if (!rows || !rows.length) {
            return null;
        }
        const [user] = rows;
        return user;
    } catch (error) {
        console.error(error);
    }
}

// get user by user id
async function getUserById(userId) {
    try {
        const { rows: [user] } = await client.query(`
        SELECT * FROM users WHERE id=$1`, [userId]);
        if (!user) {
            return null;
        }
        delete user.password;
        return user;
    } catch (error) {
        console.error(error);
    }
}

//get a user if username password macth
async function getUser({ username, password }) {
    if (!username || !password) {
        return;
    }
    try {
        const user = await getUserByUsername(username);
        if (!user) { return; }
        const pwdMatch = await bcrypt.compare(password, user.password);
        if (!pwdMatch) { return; }
        delete user.password;
        return user;
    } catch (error) {
        throw error;
    }
}

// create a cart in the DB 
async function createCart({ userId, products }) {
    console.log(userId, products);
    try {
        const { rows: [cart] } = await client.query(`
        INSERT INTO carts("userId") VALUES ($1) RETURNING id, "userId", date`, [userId]);

        let cartProductQuery = '';
        products.map(async (product) => {
            cartProductQuery += `INSERT INTO cartproducts("cartId", "productId", quantity) VALUES (${cart.id},${product.productId},${product.quantity});`;
        });
        await client.query(cartProductQuery);
        cart.products = products;
        return cart;
    } catch (error) {
        throw (error);
    }
}

async function getUserCarts(userId) {
    try {
        console.log(userId);
        const { rows } = await client.query(`
        SELECT * FROM carts WHERE "userId"=$1`, [userId]);
        if (!rows || !rows.length) {
            return null;
        }
        return rows;
    } catch (error) {
        console.error(error);
    }
}

module.exports = { createUser, getUserByUsername, getUser, getUserById, createCart, getUserCarts };