const client = require("./client");
const { createUser } = require("./users");

// DROP any pre-existing tables
async function dropTables() {
    console.log("Dropping all tables...");
    try {
        await client.query(`
       DROP TABLE IF EXISTS users;`);
    } catch (error) {
        throw error;
    }
}
//  CREATE our DB tables

async function createTables() {
    console.log("Building DB tables...");
    try {
        await client.query(`CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )`);
    } catch (error) {
        console.error("error creating tables");
        throw error;
    }
}

// INSERT dummy data into users table 
async function createInitialUsers() {
    console.log('Creating users seed data...');
    try {
        const fakeUsers = [
            { username: "user1", password: "user1pwd" },
            { username: "user2", password: "user2pwd" },
            { username: "user3", password: "user3pwd" },
            { username: "user4", password: "user4pwd" }
        ];
        const users = await Promise.all(fakeUsers.map(createUser));
        console.log("users Created!");
        console.log(users);
    } catch (error) {
        console.error("error creating users");
        throw (error);
    }
}


// run all seed functions to seed our DB 
async function rebuildDB() {
    try {
        client.connect();
        console.log("connected to DB client");
        await dropTables();
        await createTables();
        await createInitialUsers();
    } catch (err) {
        console.error("error during DB rebuild");
        throw err;
    }
}

module.exports = { rebuildDB };