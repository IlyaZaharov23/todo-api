const UserController = require("../controllers/user.controller");
const Router = require("express");
const ValidationHelpers = require("../helpers/ValidationHelpers");
const userValidator = require("../validations/user.validation");

const validationHelpers = new ValidationHelpers();
const userRouter = Router();

userRouter.post(
  "/login",
  userValidator.authUser,
  validationHelpers.chechValidation,
  UserController.userAuth
);
userRouter.post(
  "/register",
  userValidator.createUser,
  validationHelpers.chechValidation,
  UserController.userRegister
);

module.exports = userRouter;
