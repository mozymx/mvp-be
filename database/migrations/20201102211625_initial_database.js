exports.up = function(knex) {
    return knex.schema.createTable("customer", (customer) => {
        customer.increments("id");
        customer.string("name").notNullable();
        customer.string("email").notNullable().unique();
        customer.string("phone").notNullable().unique();
        customer.string("password").notNullable();
        customer.timestamps(false, true);
    })
  };
  
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("customer");
};
