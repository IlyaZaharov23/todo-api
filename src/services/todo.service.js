const Todo = require("../model/todo.model");
const {
  ERRORS_TYPE,
  ENTITY_PATH,
  ERRORS_LOCATION,
  ERROR_MESSAGES,
} = require("../constants/errors.template");
const ValidationError = require("../helpers/ValidationError");

class TodoService {
  static async getTodos(idUser) {
    try {
      const todos = await Todo.find({ idUser });
      return todos;
    } catch (error) {
      throw error;
    }
  }
  static async createTodo(title, userId) {
    try {
      const sendedData = {
        title,
        idUser: userId,
        isCompleted: false,
      };
      const newTodo = await new Todo(sendedData).save();
      return newTodo.toObject();
    } catch (error) {
      throw error;
    }
  }
  static async updateTodoTitle(title, todoId, userId) {
    try {
      const updatedTodo = await Todo.findByIdAndUpdate(
        { _id: todoId, idUser: userId },
        { $set: { title } },
        { new: true }
      );
      if (!updatedTodo) {
        throw new ValidationError(
          [
            {
              type: ERRORS_TYPE.FIELD,
              value: title,
              msg: ERROR_MESSAGES.TODO_NOT_FOUND,
              path: ENTITY_PATH.TITLE,
              location: ERRORS_LOCATION.BODY,
            },
          ],
          404
        );
      }
      return updatedTodo;
    } catch (error) {
      throw error;
    }
  }
  static async updateTodoCompleted(isCompleted, todoId, userId) {
    try {
      const updatedTodo = await Todo.findOneAndUpdate(
        { _id: todoId, idUser: userId },
        { $set: { isCompleted } },
        { new: true }
      );
      if (!updatedTodo) {
        throw new ValidationError(
          [
            {
              type: ERRORS_TYPE.FIELD,
              value: isCompleted,
              msg: ERROR_MESSAGES.TODO_NOT_FOUND,
              path: ENTITY_PATH.IS_COMPLETED,
              location: ERRORS_LOCATION.BODY,
            },
          ],
          404
        );
      }
      return updatedTodo;
    } catch (error) {
      throw error;
    }
  }
  static async deleteTodo(todoId, userId) {
    try {
      const result = await Todo.deleteOne({ _id: todoId, idUser: userId });
      if (result.deletedCount === 0) {
        throw new ValidationError(
          [
            {
              type: ERRORS_TYPE.FIELD,
              msg: ERROR_MESSAGES.TODO_NOT_FOUND,
              path: ENTITY_PATH.TITLE,
              location: ERRORS_LOCATION.BODY,
            },
          ],
          404
        );
      }
      return todoId;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TodoService;
