const UserService = require("../services/user.service");
const ErrorHelpers = require("../helpers/ErrorHelpers");

class UserController {
  static async userRegister(req, res) {
    try {
      const newUser = await UserService.createUser(req.body);
      res.status(201).send(newUser);
    } catch (error) {
      ErrorHelpers.catchError(res, error, 500);
    }
  }
  static async userAuth(req, res) {
    try {
      const data = await UserService.authUser(req.body);
      res.send(data);
    } catch (error) {
      ErrorHelpers.catchError(res, error, 400);
    }
  }
}

module.exports = UserController;
