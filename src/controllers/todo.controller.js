const TodoService = require("../services/todo.service");
const { ERRORS_TEMPLATE } = require("../constants/errors.template");

class TodoController {
  static async getTodos(req, res) {
    try {
      const { userId } = req.query;
      const todos = await TodoService.getTodos(userId);
      res.send(todos);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  static async createTodo(req, res) {
    try {
      const { title, userId } = req.body;
      const newTodo = await TodoService.createTodo(title, userId);
      res.status(201).send(newTodo);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  static async updateTodoTitle(req, res) {
    try {
      const { id } = req.params;
      const { title, userId } = req.body;
      const updateTodo = await TodoService.updateTodoTitle(title, id, userId);
      res.send(updateTodo);
    } catch (error) {
      if (error.errors?.length) {
        return res.status(404).send(error.errors);
      }
      res.status(500).send(error.message);
    }
  }
  static async updateTodoCompleted(req, res) {
    try {
      const { id } = req.params;
      const { isCompleted, userId } = req.body;
      const updateTodo = await TodoService.updateTodoCompleted(
        isCompleted,
        id,
        userId
      );
      res.send(updateTodo);
    } catch (error) {
      if (error.errors?.length) {
        return res.status(404).send(error.errors);
      }
      res.status(500).send(error.message);
    }
  }
  static async deleteTodo(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.query;
      const deletedToId = await TodoService.deleteTodo(id, userId);
      res.status(200).send(deletedToId);
    } catch (error) {
      if (error.errors?.length) {
        return res.status(404).send(error.errors);
      }
      res.status(500).send(error.message);
    }
  }
}

module.exports = TodoController;
