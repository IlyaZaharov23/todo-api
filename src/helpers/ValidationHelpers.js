const { ERROR_MESSAGES } = require("../constants/errors.template");
const MongoHelpers = require("./MongoHelpers");
const ENTITIES = require('../constants/entities')

class ValidationHelpers {
  #COLLECTION = ENTITIES.USERS
  async isUserExist(email) {
    const connection = await MongoHelpers.getConnection();
    const db = MongoHelpers.useDefaultDb(connection);
    const collection = db.collection(this.#COLLECTION)
    const targetUser = await collection.findOne({ email });
    if (targetUser) {
      throw new Error(ERROR_MESSAGES.USER_EXISTS);
    }
  }
}

module.exports = ValidationHelpers;
