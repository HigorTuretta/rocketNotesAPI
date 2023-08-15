const { Router } = require("express");
const TagsController = require("../controllers/TagsController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const tagsRoutes = Router();

const tagsController = new TagsController();

tagsRoutes.get("/", ensureAuthenticated, tagsController.index);

module.exports = tagsRoutes;

// EXEMPLO DE MIDDLEWARE
// function myMiddleware(req, res, next) {
//   console.log("Você passou pelo Middleware!");

//   if (!req.body.isAdmin) {
//     return res.json({ message: "user unauthorized!" });
//   }

//   next();
// }
