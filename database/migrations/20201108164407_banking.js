exports.up = function(knex) {
    return knex.schema
    .createTable("belvo", (belvo) => {
        belvo.increments("id");
        belvo.integer("customer_id")
        .unsigned()
        .notNullable()
        .references("customer.id");
        belvo.timestamps(false, true);
    })
    .createTable("bank_link", (bank_link) => {
        bank_link.increments("id");
        bank_link.string("bank_name").notNullable();
        bank_link.string("link_type").notNullable();
        bank_link.string("link_status").notNullable();
        bank_link.integer("belvo_id")
        .unsigned()
        .notNullable()
        .references("belvo.id");
        bank_link.timestamps(false, true);
    })
};

exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists("bank_link")
    .dropTableIfExists("belvo");
};