exports.up = function (knex) {
  return knex.schema.createTable("account", (account) => {
    account.increments("id");
    account.string("name").notNullable();
    account.string("number").notNullable();
    account.string("type").notNullable();
    account.string("category").notNullable();
    account.string("currency").notNullable();
    account.integer("bank_id").unsigned().notNullable().references("bank.id");
    account.timestamps(false, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("account");
};
