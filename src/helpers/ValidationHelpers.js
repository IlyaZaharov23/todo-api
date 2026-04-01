const FileUtiles = require("../utilities/FileUtiles");
const { ERRORS_TEMPLATE } = require("../constants/errors.template");

class ValidationHelpers {
  #fileUtiles = new FileUtiles();
  async isUserExist(email) {
    const users = await this.#fileUtiles.getUsers();
    const targetUser = users.find((user) => user.email === email);
    if (targetUser) {
      throw new Error(ERRORS_TEMPLATE.USER_EXIST);
    }
  }
}

module.exports = ValidationHelpers;
