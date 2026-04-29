const TodoService = require("../services/todo.service");
const ErrorHelpers = require("../helpers/ErrorHelpers");

class TodoController {
  static async getTodos(req, res) {
    try {
      const userId = req.user.id 
      const todos = await TodoService.getTodos(userId);
      res.send(todos);
    } catch (error) {
      ErrorHelpers.catchError(res, error, 500);
    }
  }
  static async createTodo(req, res) {
    try {
      const { title } = req.body;      
      const userId = req.user.id
      const newTodo = await TodoService.createTodo(title, userId);
      res.status(201).send(newTodo);
    } catch (error) {
      ErrorHelpers.catchError(res, error, 500);
    }
  }
  static async updateTodoTitle(req, res) {
    try {
      const { id } = req.params;
      const { title } = req.body;
      const userId = req.user.id
      const updateTodo = await TodoService.updateTodoTitle(title, id, userId);
      res.send(updateTodo);
    } catch (error) {
      ErrorHelpers.catchError(res, error, 404);
    }
  }
  static async updateTodoCompleted(req, res) {
    try {
      const { id } = req.params;
      const { isCompleted } = req.body;
      const userId = req.user.id
      const updateTodo = await TodoService.updateTodoCompleted(
        isCompleted,
        id,
        userId
      );
      res.send(updateTodo);
    } catch (error) {
      ErrorHelpers.catchError(res, error, 404);
    }
  }
  static async deleteTodo(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id
      const deletedToId = await TodoService.deleteTodo(id, userId);
      res.status(200).send({ id: deletedToId });
    } catch (error) {
      ErrorHelpers.catchError(res, error, 404);
    }
  }
}

module.exports = TodoController;
