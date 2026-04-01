const FileUtiles = require("../utilities/FileUtiles");
const ERRORS_TEMPLATE = require("../constants/errors.template");
const { validationResult } = require("express-validator");

class ValidationHelpers {
  #fileUtiles = new FileUtiles();
  async isUserExist(email) {
    const users = await this.#fileUtiles.getUsers();
    const targetUser = users.find((user) => user.email === email);
    if (targetUser) {
      throw new Error(ERRORS_TEMPLATE.USER_EXIST);
    }
  }
  async chechValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }
    next();
  }
}

module.exports = ValidationHelpers;
