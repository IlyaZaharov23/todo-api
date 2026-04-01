const Router = require("express");
const TodoController = require("../controllers/todo.controller");
const todoValidator = require("../validations/todo.validation");
const ValidationMiddleware = require("../middlewares/validation.middleware");

const todoRouter = Router();

todoRouter
  .route("/todos")
  .get(
    todoValidator.getTodos,
    ValidationMiddleware.chechValidation,
    TodoController.getTodos
  )
  .post(
    todoValidator.createTodo,
    ValidationMiddleware.chechValidation,
    TodoController.createTodo
  );
todoRouter
  .route("/todos/:id")
  .patch(
    todoValidator.updateTodoTitle,
    ValidationMiddleware.chechValidation,
    TodoController.updateTodoTitle
  )
  .delete(
    todoValidator.deleteTodo,
    ValidationMiddleware.chechValidation,
    TodoController.deleteTodo
  );
todoRouter.patch(
  "/todos/:id/isCompleted",
  todoValidator.updateTodoCompleted,
  ValidationMiddleware.chechValidation,
  TodoController.updateTodoCompleted
);

module.exports = todoRouter;
