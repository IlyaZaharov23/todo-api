const { v4: uuid } = require("uuid");
const FileUtiles = require("../utilities/FileUtiles");
const CryptHelpers = require("../helpers/CryptHelpers");
const TokenHelpers = require("../helpers/TokenHelpers");
const {
  ERRORS_TYPE,
  ERRORS_LOCATION,
  ENTITY_PATH,
  ERROR_MESSAGES,
} = require("../constants/errors.template");
const ValidationError = require("../helpers/ValidationError");

class UserService {
  static #fileUtiles = new FileUtiles();
  static async createUser(data) {
    try {
      const users = await this.#fileUtiles.getUsers();
      const { email, password } = data;
      const hashedPassword = await CryptHelpers.hashPassword(password);
      const id = uuid();
      const newUser = { email, password: hashedPassword, id };
      users.push(newUser);
      await this.#fileUtiles.updateUsers(users);
      return { id, email };
    } catch (error) {
      throw error;
    }
  }
  static async authUser(data) {
    try {
      const users = await this.#fileUtiles.getUsers();
      const targetUser = users.find((user) => user.email === data.email);
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
