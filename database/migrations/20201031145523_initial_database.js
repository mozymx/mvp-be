exports.up = function(knex) {
    return knex.schema.createTable("users", users => {
        users.increments("id");
        users.string("name", 255).notNullable();
        users.string("email", 255).notNullable().unique();
        users.string("phone", 255);
        users.string("password", 255).notNullable();
        users.timestamps(false, true);
    })
  };
  
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("users");
};