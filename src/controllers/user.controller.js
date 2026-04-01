const UserService = require("../services/user.service");

class UserController {
  static async userRegister(req, res) {
    try {
      const newUser = await UserService.createUser(req.body);
      res.send(newUser);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  static async userAuth(req, res) {
    try {
      const token = await UserService.authUser(req.body);
      res.send(token);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = UserController;
