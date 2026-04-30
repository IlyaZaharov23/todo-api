const MongoHelpers = require("../helpers/MongoHelpers");
const {
  ERRORS_TYPE,
  ENTITY_PATH,
  ERRORS_LOCATION,
  ERROR_MESSAGES,
} = require("../constants/errors.template");
const ValidationError = require("../helpers/ValidationError");
const { v4: uuid } = require("uuid");
const ENTITIES = require("../constants/entities");

class TodoService {
  static #COLLECTION = ENTITIES.TODOS;
  static async getTodos(idUser) {
    return MongoHelpers.collectionDbProcess(
      this.#COLLECTION,
      async (collection) => {
        const todos = await collection.find({ idUser }).toArray();
        return todos;
      }
    );
  }
  static async createTodo(title, idUser) {
    return MongoHelpers.collectionDbProcess(
      this.#COLLECTION,
      async (collection) => {
        const newTodo = {
          title,
          idUser,
          isCompleted: false,
          id: uuid(),
        };
        await collection.insertOne(newTodo);
        return newTodo;
      }
    );
  }
  static async updateTodoTitle(title, todoId, userId) {
    return MongoHelpers.collectionDbProcess(
      this.#COLLECTION,
      async (collection) => {
        const updatedTodo = await collection.findOneAndUpdate(
          { id: todoId, idUser: userId },
          { $set: { title } },
          { returnDocument: "after" }
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
      }
    );
  }
  static async updateTodoCompleted(isCompleted, todoId, userId) {
    return MongoHelpers.collectionDbProcess(
      this.#COLLECTION,
      async (collection) => {
        const updatedTodo = await collection.findOneAndUpdate(
          { id: todoId, idUser: userId },
          { $set: { isCompleted } },
          { returnDocument: "after" }
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
      }
    );
  }
  static async deleteTodo(todoId, userId) {
    return MongoHelpers.collectionDbProcess(
      this.#COLLECTION,
      async (collection) => {
        const result = await collection.deleteOne({
          id: todoId,
          idUser: userId,
        });
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
      }
    );
  }
}

module.exports = TodoService;
