require("dotenv").config();

module.exports = {

  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    searchPath: ['knex', 'public'],
    useNullAsDefault: true,
    migrations: {
      directory: "./database/migrations",
    },
    seeds: {
      directory: "./database/seeds/development"
    },
  },
  testing: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    searchPath: ['knex', 'public'],
    useNullAsDefault: true,
    migrations: {
      directory: "./database/migrations"
    },
    seeds: {
      directory: "./database/seeds/testing"
    }
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    searchPath: ['knex', 'public'],
    useNullAsDefault: true,
    migrations: {
      directory: "./database/migrations"
    }
  }

};
