const UserController = require("../controllers/user.controller");
const Router = require("express");
const userValidator = require("../validations/user.validation");
const ValidationMiddleware = require("../middlewares/validation.middleware");

const userRouter = Router();

userRouter.post(
  "/login",
  userValidator.authUser,
  ValidationMiddleware.chechValidation,
  UserController.userAuth
);
userRouter.post(
  "/register",
  userValidator.createUser,
  ValidationMiddleware.chechValidation,
  UserController.userRegister
);

module.exports = userRouter;
