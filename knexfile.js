
const path = require('path')

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: path.resolve(__dirname, 'src', 'database', 'database.db'), // Pegando o caminho do banco de dados
    },
    pool: {
      afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb) //Habilita o delete em CASCADE no SQLite
    },
    migrations: {
      directory: path.resolve(__dirname, 'src','database','knex','migrations')
    },
    useNullAsDefault: true //isso é padrão do SQLite
  },
};
