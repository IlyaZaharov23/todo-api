const Router = require("express");
const todoRouter = require("./todo.routes");
const mainRouter = Router();

mainRouter.use(todoRouter);

module.exports = mainRouter;
