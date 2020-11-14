exports.up = function(knex) {
    return knex.schema.createTable("bank", (bank) => {
        bank.increments("id");
        bank.string("name").notNullable();
        bank.string("link").notNullable();
        bank.string("link_type").notNullable();
        bank.string("link_status").notNullable();
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