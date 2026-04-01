const Router = require("express");
const todoRouter = require("./todo.routes");
const userRouter = require("./user.routes");
const mainRouter = Router();

mainRouter.use(todoRouter);
mainRouter.use(userRouter);

module.exports = mainRouter;
