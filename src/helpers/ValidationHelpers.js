const { ERROR_MESSAGES } = require("../constants/errors.template");
const User = require("../model/users.model");

class ValidationHelpers {
  async isUserExist(email) {
    const targetUser = await User.findOne({ email });
    if (targetUser) {
      throw new Error(ERROR_MESSAGES.USER_EXISTS);
    }
  }
}

module.exports = ValidationHelpers;
