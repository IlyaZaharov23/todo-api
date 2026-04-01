const { v4: uuid } = require("uuid");
const FileUtiles = require("../utilities/FileUtiles");
const ERRORS_TEMPLATE = require("../constants/errors.template");

class TodoService {
  static #fileUtiles = new FileUtiles();
  static async getTodos(userId) {
    try {
      const todos = await this.#fileUtiles.getUserTodos(userId);
      return todos;
    } catch (error) {
      return [];
    }
  }
  static async createTodo(title, userId) {
    try {
      const todos = await this.#fileUtiles.getUserTodos(userId);
      const newTodo = {
        title,
        idUser: userId,
        id: uuid(),
        isCompleted: false,
      };
      todos.push(newTodo);
      await this.#fileUtiles.updateUserTodos(userId, todos);
      return newTodo;
    } catch (error) {
      throw error;
    }
  }
  static async updateTodoTitle(title, todoId, userId) {
    try {
      const todos = await this.#fileUtiles.getUserTodos(userId);
      const targetTodo = todos.find((todo) => todo.id === todoId);
      if (!targetTodo) {
        throw new Error(ERRORS_TEMPLATE.TODO_NOT_FOUND);
      }
      targetTodo.title = title;
      await this.#fileUtiles.updateUserTodos(userId, todos);
      return targetTodo;
    } catch (error) {
      throw error;
    }
  }
  static async updateTodoCompleted(isCompleted, todoId, userId) {
    try {
      const todos = await this.#fileUtiles.getUserTodos(userId);
      const targetTodo = todos.find((todo) => todo.id === todoId);
      if (!targetTodo) {
        throw new Error(ERRORS_TEMPLATE.TODO_NOT_FOUND);
      }
      targetTodo.isCompleted = isCompleted;
      await this.#fileUtiles.updateUserTodos(userId, todos);
      return targetTodo;
    } catch (error) {
      throw error;
    }
  }
  static async deleteTodo(todoId, userId) {
    try {
      const todos = await this.#fileUtiles.getUserTodos(userId);
      const targetTodoIndex = todos.findIndex((todo) => todo.id === todoId);
      if (targetTodoIndex === -1) {
        throw new Error(ERRORS_TEMPLATE.TODO_NOT_FOUND);
      }
      todos.splice(targetTodoIndex, 1);
      await this.#fileUtiles.updateUserTodos(userId, todos);
      return todoId;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TodoService;
