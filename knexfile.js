require("dotenv").config();

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host : process.env['DB_URL'],
      user : process.env['DB_USERNAME'],
      password : process.env['DB_PASSWORD'],
      database : process.env['DB_NAME']
    },
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
    connection: {
      host : process.env['DB_URL'],
      user : process.env['DB_USERNAME'],
      password : process.env['DB_PASSWORD'],
      database : process.env['DB_NAME']
    },
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
    connection: {
      host : process.env['DB_URL'],
      user : process.env['DB_USERNAME'],
      password : process.env['DB_PASSWORD'],
      database : process.env['DB_NAME']
    },
    searchPath: ['knex', 'public'],
    useNullAsDefault: true,
    migrations: {
      directory: "./database/migrations"
    }
  }

};
