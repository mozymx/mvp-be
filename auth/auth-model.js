const db = require("../database/dbConfig");

module.exports = {
    addUser,
    findUserBy,
}

// add a user and return it
async function addUser(user) {
    const [id] = await db("users").insert(user, "id");
    return findUserById(id);
}

// find user by id
function findUserById(id) {
    return db("users").where({ id }).first();
}

// find user by other criteria
function findUserBy(filter) {
    return db("users").where(filter).orderBy("id");
}