exports.up = function(knex) {
    return knex.schema.createTable("benefits", (benefits) => {
        benefits.increments("id");
        benefits.integer("savings").defaultTo(5);
        benefits.integer("investment").defaultTo(10);
        benefits.integer("taxes").defaultTo(35);
        benefits.boolean("insurance").defaultTo(false);
        benefits.integer("userID").unsigned().notNullable().references("users.id");
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("benefits");
};
