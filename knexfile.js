
const path = require('path')

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'mysql.prcnotes.kinghost.net',
      user: 'prcnotes_add1',
      password: 'Abacaxi*5',
      database: 'prcnotes'
    },
    migrations: {
      directory: path.resolve(__dirname, 'src','database','knex','migrations')
    },
  },
  // Você pode adicionar configurações para outros ambientes, como produção ou teste
};
