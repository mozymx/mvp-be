exports.up = function(knex) {
    return knex.schema.createTable("bank", (bank) => {
        bank.increments("id");
        bank.string("name").notNullable();
        bank.string("account").notNullable();
        bank.string("type").notNullable();
        bank.string("status").notNullable();
        bank.integer("customer_id")
        .unsigned()
        .notNullable()
        .references("customer.id");
        bank.timestamps(false, true);
    })
};

exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists("bank")
};