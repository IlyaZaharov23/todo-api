const Router = require("express");
const TodoController = require("../controllers/todo.controller");
const todoValidator = require("../validations/todo.validation");
const ValidationHelpers = require("../helpers/ValidationHelpers");

const todoRouter = Router();
const validationHelpers = new ValidationHelpers();

todoRouter
  .route("/todos")
  .get(
    todoValidator.getTodos,
    validationHelpers.chechValidation,
    TodoController.getTodos
  )
  .post(
    todoValidator.createTodo,
    validationHelpers.chechValidation,
    TodoController.createTodo
  );
todoRouter
  .route("/todos/:id")
  .patch(
    todoValidator.updateTodoTitle,
    validationHelpers.chechValidation,
    TodoController.updateTodoTitle
  )
  .delete(
    todoValidator.deleteTodo,
    validationHelpers.chechValidation,
    TodoController.deleteTodo
  );
todoRouter.patch(
  "/todos/:id/isCompleted",
  todoValidator.updateTodoCompleted,
  validationHelpers.chechValidation,
  TodoController.updateTodoCompleted
);

module.exports = todoRouter;
