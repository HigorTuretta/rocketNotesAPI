const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const { hash, compare } = require("bcryptjs");

class UserController {
  async create(req, res) {
    const { name, email, password } = req.body;

    const checkUserExists = await knex("users")
      .where("email", email)
      .first();

    if (checkUserExists) {
      throw new AppError("Este e-mail já está em uso");
    }

    const hashedPassword = await hash(password, 8);
    await knex("users").insert({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json();
  }

  async update(req, res) {
    const { name, email, password, old_password } = req.body;
    const user_id = req.user.id;

    const user = await knex("users")
      .where("id", user_id)
      .first();

    if (!user) {
      throw new AppError("Usuário não encontrado!");
    }

    const userWithUpdatedEmail = await knex("users")
      .where("email", email)
      .whereNot("id", user.id)
      .first();

    if (userWithUpdatedEmail) {
      throw new AppError("Este e-mail já está em uso!");
    }

    user.name = name || user.name;
    user.email = email || user.email;

    if (password && !old_password) {
      throw new AppError(
        "Você precisa informar a senha antiga para definir uma nova senha."
      );
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere.");
      }

      user.password = await hash(password, 8);
    }

    await knex("users")
      .where("id", user_id)
      .update({
        name: user.name,
        email: user.email,
        password: user.password,
        updated_at: knex.fn.now(),
      });

    return res.status(200).json();
  }
}

module.exports = UserController;
