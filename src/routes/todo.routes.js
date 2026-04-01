const Router = require("express");
const TodoController = require("../controllers/todo.controller");

const todoRouter = Router();

todoRouter
  .route("/todos")
  .get(TodoController.getTodos)
  .post(TodoController.createTodo);
todoRouter
  .route("/todos/:id")
  .patch(TodoController.updateTodoTitle)
  .delete(TodoController.deleteTodo);
todoRouter.patch("/todos/:id/isCompleted", TodoController.updateTodoCompleted);

module.exports = todoRouter;
