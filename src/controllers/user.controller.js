const UserService = require("../services/user.service");
const ErrorHelpers = require("../helpers/ErrorHelpers");

class UserController {
  static async userRegister(req, res) {
    try {
      const newUser = await UserService.createUser(req.body);
      res.send(newUser);
    } catch (error) {
      ErrorHelpers.catchError(res, error, 500);
    }
  }
  static async userAuth(req, res) {
    try {
      const token = await UserService.authUser(req.body);
      res.send(token);
    } catch (error) {
      ErrorHelpers.catchError(res, error, 400);
    }
  }
}

module.exports = UserController;
