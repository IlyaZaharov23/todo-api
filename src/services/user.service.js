const User = require("../model/users.model");
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
  static async createUser(data) {
    try {
      const { email, password } = data;
      const hashedPassword = await CryptHelpers.hashPassword(password);
      const sendedData = { email, password: hashedPassword };
      const newUser = await new User(sendedData).save();
      return { id: newUser._id, email: newUser.email };
    } catch (error) {
      throw error;
    }
  }
  static async authUser(data) {
    try {
      const targetUser = await User.findOne({ email: data.email });

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
      const token = TokenHelpers.createToken(targetUser.toObject());
      return { token, userId: targetUser.id };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
