const { v4: uuid } = require("uuid");
const FileUtiles = require("../utilities/FileUtiles");
const {
  ERRORS_TEMPLATE,
  ERRORS_TYPE,
  ERRORS_PATH,
  ERRORS_LOCATION,
} = require("../constants/errors.template");
const ValidationError = require("../helpers/ValidationError");

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
        throw new ValidationError(
          [
            {
              type: ERRORS_TYPE.FIELD,
              value: title,
              msg: ERRORS_TEMPLATE.TODO_NOT_FOUND,
              path: ERRORS_PATH.TITLE,
              location: ERRORS_LOCATION.BODY,
            },
          ],
          404
        );
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
        throw new ValidationError(
          [
            {
              type: ERRORS_TYPE.FIELD,
              value: isCompleted,
              msg: ERRORS_TEMPLATE.TODO_NOT_FOUND,
              path: ERRORS_PATH.TITLE,
              location: ERRORS_LOCATION.BODY,
            },
          ],
          404
        );
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
        throw new ValidationError(
          [
            {
              type: ERRORS_TYPE.FIELD,
              msg: ERRORS_TEMPLATE.TODO_NOT_FOUND,
              path: ERRORS_PATH.TITLE,
              location: ERRORS_LOCATION.BODY,
            },
          ],
          404
        );
      }
      todos.splice(targetTodoIndex, 1);

      if (todos.length === 0) {
        await this.#fileUtiles.deleteUserTodos(userId);
      } else {
        await this.#fileUtiles.updateUserTodos(userId, todos);
      }
      return todoId;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TodoService;
