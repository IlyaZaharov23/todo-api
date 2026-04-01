const { v4: uuid } = require("uuid");
const FileUtiles = require("../utilities/FileUtiles");
const CryptHelpers = require("../helpers/CryptHelpers");
const TokenHelpers = require("../helpers/TokenHelpers");
const ERRORS_TEMPLATE = require("../constants/errors.template");

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
      return id;
    } catch (error) {
      throw error;
    }
  }
  static async authUser(data) {
    try {
      const users = await this.#fileUtiles.getUsers();
      const targetUser = users.find((user) => user.email === data.email);
      if (!targetUser) {
        throw new Error(ERRORS_TEMPLATE.USER_NOT_FOUND);
      }
      const isPasswordValid = await CryptHelpers.checkPassword(
        data.password,
        targetUser.password
      );
      if (!isPasswordValid) {
        throw new Error(ERRORS_TEMPLATE.INVALID_PASSWORD);
      }
      const token = TokenHelpers.createToken(targetUser);
      return token;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
