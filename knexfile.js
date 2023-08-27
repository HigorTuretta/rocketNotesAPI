
const path = require('path')
require('dotenv').config()

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DATABASE_HOST,
      user:  process.env.DATABASE_USER,
      password:  process.env.DATABASE_PASSWORD,
      database:  process.env.DATABASE_DB,
      charset: 'utf8mb4'
    },
    migrations: {
      directory: path.resolve(__dirname, 'src','database','knex','migrations')
    },
  },
  // Você pode adicionar configurações para outros ambientes, como produção ou teste
};
