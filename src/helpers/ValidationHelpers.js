const FileUtiles = require("../utilities/FileUtiles");
const { ERROR_MESSAGES } = require("../constants/errors.template");

class ValidationHelpers {
  #fileUtiles = new FileUtiles();
  async isUserExist(email) {
    const users = await this.#fileUtiles.getUsers();
    const targetUser = users.find((user) => user.email === email);
    if (targetUser) {
      throw new Error(ERROR_MESSAGES.USER_EXISTS);
    }
  }
}

module.exports = ValidationHelpers;
