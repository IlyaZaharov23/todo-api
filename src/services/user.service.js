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
const ValidationError = require("../helpers/ValidationError");
const ENTITIES = require("../constants/entities");

class UserService {
  static #COLLECTION = ENTITIES.USERS;
  static async createUser(data) {
    return MongoHelpers.collectionDbProcess(
      this.#COLLECTION,
      async (collection) => {
        const { email, password } = data;
        const hashedPassword = await CryptHelpers.hashPassword(password);
        const id = uuid();
        const sendedData = { email, password: hashedPassword, id };
        await collection.insertOne(sendedData);
        return { id: sendedData.id, email: sendedData.email };
      }
    );
  }
  static async authUser(data) {
    return MongoHelpers.collectionDbProcess(
      this.#COLLECTION,
      async (collection) => {
        const targetUser = await collection.findOne({ email: data.email });
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
      }
    );
  }
}

module.exports = UserService;
