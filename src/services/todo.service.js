const { v4: uuid } = require("uuid");
const MongoHelpers = require("../helpers/MongoHelpers");
const {
  ERRORS_TYPE,
  ENTITY_PATH,
  ERRORS_LOCATION,
  ERROR_MESSAGES,
} = require("../constants/errors.template");
const ENTITIES = require("../constants/entities");
const ValidationError = require("../helpers/ValidationError");

class TodoService {
  static #COLLECTION = ENTITIES.TODOS;
  static async getTodos(idUser) {
    try {
      const connection = await MongoHelpers.getConnection();
      const db = MongoHelpers.useDefaultDb(connection);
      const collection = db.collection(this.#COLLECTION);
      const todos = await collection.find({ idUser }).toArray();
      await connection.close();
      return todos;
    } catch (error) {
      throw error
    }
  }
  static async createTodo(title, userId) {
    try {
      const newTodo = {
        title,
        idUser: userId,
        id: uuid(),
        isCompleted: false,
      };
      const connection = await MongoHelpers.getConnection();
      const db = MongoHelpers.useDefaultDb(connection);
      const collection = db.collection(this.#COLLECTION);
      await collection.insertOne(newTodo);
      await connection.close();
      return newTodo;
    } catch (error) {
      throw error;
    }
  }
  static async updateTodoTitle(title, todoId, userId) {
    try {
      const connection = await MongoHelpers.getConnection();
      const db = MongoHelpers.useDefaultDb(connection);
      const collection = db.collection(this.#COLLECTION);
      const updatedTodo = await collection.findOneAndUpdate(
        { id: todoId, idUser: userId },
        { $set: { title } },
        { returnDocument: "after" }
      );
      await connection.close();
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
      const connection = await MongoHelpers.getConnection();
      const db = MongoHelpers.useDefaultDb(connection);
      const collection = db.collection(this.#COLLECTION);
      const updatedTodo = await collection.findOneAndUpdate(
        { id: todoId, idUser: userId },
        { $set: { isCompleted } },
        { returnDocument: "after" }
      );
      await connection.close();
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
      const connection = await MongoHelpers.getConnection();
      const db = MongoHelpers.useDefaultDb(connection);
      const collection = db.collection(this.#COLLECTION);
      const result = await collection.deleteOne({ id: todoId, idUser: userId });
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
