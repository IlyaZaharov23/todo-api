const Router = require("express");
const TodoController = require("../controllers/todo.controller");
const todoValidator = require("../validations/todo.validation");
const ValidationMiddleware = require("../middlewares/validation.middleware");

const todoRouter = Router();

todoRouter
  .route("/todos")
  .get(
    todoValidator.getTodos,
    ValidationMiddleware.checkValidation,
    TodoController.getTodos
  )
  .post(
    todoValidator.createTodo,
    ValidationMiddleware.checkValidation,
    TodoController.createTodo
  );
todoRouter
  .route("/todos/:id")
  .patch(
    todoValidator.updateTodoTitle,
    ValidationMiddleware.checkValidation,
    TodoController.updateTodoTitle
  )
  .delete(
    todoValidator.deleteTodo,
    ValidationMiddleware.checkValidation,
    TodoController.deleteTodo
  );
todoRouter.patch(
  "/todos/:id/isCompleted",
  todoValidator.updateTodoCompleted,
  ValidationMiddleware.checkValidation,
  TodoController.updateTodoCompleted
);

module.exports = todoRouter;
