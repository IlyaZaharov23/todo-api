const { v4: uuid } = require("uuid");
const MongoHelpers = require("../helpers/MongoHelpers");
const CryptHelpers = require("../helpers/CryptHelpers");
const TokenHelpers = require("../helpers/TokenHelpers");
const {
  ERRORS_TYPE,
  ERRORS_LOCATION,
  ENTITY_PATH,
  ERROR_MESSAGES,
} = require("../constants/errors.template");
const ENTITIES = require('../constants/entities')
const ValidationError = require("../helpers/ValidationError");

class UserService {
  static #COLLECTION = ENTITIES.USERS;
  static async createUser(data) {
    try {
      const { email, password } = data;
      const hashedPassword = await CryptHelpers.hashPassword(password);
      const id = uuid();
      const newUser = { email, password: hashedPassword, id };
      const connection = await MongoHelpers.getConnection();
      const db = MongoHelpers.useDefaultDb(connection);
      await db.collection(this.#COLLECTION).insertOne(newUser);
      await connection.close();
      return { id, email };
    } catch (error) {
      throw error;
    }
  }
  static async authUser(data) {
    try {
      const connection = await MongoHelpers.getConnection();
      const db = MongoHelpers.useDefaultDb(connection);
      const collection = db.collection(this.#COLLECTION);

      const targetUser = await collection.findOne({ email: data.email });
      await connection.close();
      
      if (!targetUser) {
        throw new ValidationError(
          [
            {
              type: ERRORS_TYPE.FIELD,
              value: data.email,
              msg: ERROR_MESSAGES.INVALID_LOGIN,
              path: ENTITY_PATH.EMAIL,
              location: ERRORS_LOCATION.BODY,
            },
            {
              type: ERRORS_TYPE.FIELD,
              value: data.password,
              msg: ERROR_MESSAGES.INVALID_LOGIN,
              path: ENTITY_PATH.PASSWORD,
              location: ERRORS_LOCATION.BODY,
            },
          ],
          404
        );
      }
      const isPasswordValid = await CryptHelpers.checkPassword(
        data.password,
        targetUser.password
      );
      if (!isPasswordValid) {
        throw new ValidationError(
          [
            {
              type: ERRORS_TYPE.FIELD,
              value: data.password,
              msg: ERROR_MESSAGES.INVALID_LOGIN,
              path: ENTITY_PATH.PASSWORD,
              location: ERRORS_LOCATION.BODY,
            },
          ],
          401
        );
      }
      const token = TokenHelpers.createToken(targetUser);
      return { token, userId: targetUser.id };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
