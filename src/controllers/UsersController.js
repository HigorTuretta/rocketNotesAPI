const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqllite");
const { hash, compare } = require("bcryptjs");
class UserController {
  /*
        Boas práticas de um Controller
        Ter no máximo 5 métodos para cada controller sendo:
        index - GET para listar vários registros
        show  - GET para exibir um registro específico
        create - POST para criar um registro
        update - PUT para atualizr um registro
        delete - DELETE para remover um registro
    */

  async create(req, res) {
    const { name, email, password } = req.body;

    const database = await sqliteConnection();

    const checkUserExists = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (checkUserExists) {
      throw new AppError("Este e-mail já está em uso");
    }
    const hashedPassword = await hash(password, 8);
    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return res.status(201).json();
  }

  async update(req, res) {
    const { name, email, password, old_password } = req.body;
    const user_id = req.user.id;

    const database = await sqliteConnection();

    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);
    
    if (!user) {
      throw new AppError("Usuário não encontrado!");
    }

    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );
    //Check se o email que o usuário quer atualizar já está em uso por outro usuário.
    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este e-mail já está em uso!");
    }

    //verifica se existe conteudo de nome e email, para assim substituir  
    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password){
      throw new AppError("Você precisa informar a senha antiga para definir uma nova senha.")
    }

    if (password && old_password){
      const checkOldPassword = await compare(old_password, user.password)

      if (!checkOldPassword){
        throw new AppError("A senha antiga não confere.")
      }

      user.password = await hash(password, 8)
    }

    await database.run(
      `
      UPDATE users SET 
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?
    `,
      [user.name, user.email, user.password, user_id]
    );

    return res.status(200).json();
  }
}

module.exports = UserController;
