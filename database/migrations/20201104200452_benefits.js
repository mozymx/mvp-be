exports.up = function(knex) {
    return knex.schema.createTable("benefit", (benefit) => {
        benefit.increments("benefit_id");
        benefit.integer("savings").defaultTo(5);
        benefit.integer("investment").defaultTo(10);
        benefit.integer("taxes").defaultTo(35);
        benefit.boolean("insurance").defaultTo(false);
        benefit.integer("customer_id").unsigned().notNullable().references("customer.customer_id");
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("benefit");
};
