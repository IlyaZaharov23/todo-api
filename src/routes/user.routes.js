const UserController = require("../controllers/user.controller");
const Router = require("express");

const userRouter = Router();

userRouter.post("/login", UserController.userAuth);
userRouter.post("/register", UserController.userRegister);

module.exports = userRouter;
