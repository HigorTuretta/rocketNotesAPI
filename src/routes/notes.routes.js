const { Router } = require("express");
const NotesController = require("../controllers/NotesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const notesRoutes = Router();

const notesController = new NotesController();


notesRoutes.use(ensureAuthenticated); // tecnica para utilizar o middleware em todas as rotas

notesRoutes.get("/", notesController.index);
notesRoutes.post("/", notesController.create);
notesRoutes.get("/:id", notesController.show);
notesRoutes.delete("/:id", notesController.delete);

module.exports = notesRoutes;

// EXEMPLO DE MIDDLEWARE
// function myMiddleware(req, res, next) {
//   console.log("Você passou pelo Middleware!");

//   if (!req.body.isAdmin) {
//     return res.json({ message: "user unauthorized!" });
//   }

//   next();
// }
