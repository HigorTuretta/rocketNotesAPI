require('dotenv/config')
require("express-async-errors");
const express = require("express");
const routes = require("./routes");
const AppError = require("./utils/AppError");
const migrationsRun = require('./database/sqllite/migrations')
const uploadConfig = require('./configs/upload');
const cors = require('cors')
migrationsRun()

// inicia o express
const app = express();
app.use(cors())
app.use(express.json()); //seta o padrão de tipo da API para JSON

app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER))

app.use(routes);

app.use((error, req, res, nex) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

const PORT = 3333;
//inicia o servidor na porta informada
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

// //Metodo GET com parametro
// app.get("/message/:id/:user", (req, res) => {
//     //desestruturação para pegar o id e o user diretamente de req.params
//     //assim evita a repetição de código: req.params.id e req.params.user
//     const {id, user} = req.params

//     res.send(`
//         ID da Mensagem: ${id} -
//         Usuário: ${user}.
//     `)
// });

//EXEMPLO DE QUERY PARAMS, onde os parametros sao opcionais, como exemplo a page e o limit
// app.get('/users', (req, res) => {
//     const {page, limit} = req.query

//     res.send(`Página: ${page}. Mostrar: ${limit}`)
// })
