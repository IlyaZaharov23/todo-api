const { header, param, body, checkExact } = require("express-validator");
const TokenHelpers = require("../helpers/TokenHelpers");
const { ERROR_MESSAGES, ENTITY_PATH } = require("../constants/errors.template");

const todoRequirements = {
  token: header("Authorization")
    .exists()
    .withMessage("Token is required.")
    .bail()
    .custom((value) => {
      if (!value.startsWith("Bearer ")) {
        throw new Error("Invalid authorization format. Use Bearer <token>");
      }
      return true;
    })
    .bail()
    .customSanitizer((value) => value.split(" ")[1])
    .isJWT()
    .withMessage("Invalid JWT token.")
    .custom((token, { req }) => {
      const verification = TokenHelpers.checkToken(token);
      if (!verification.isValid) {
        if (verification.error === "jwt expired") {
          throw new Error("Token has expired. Please login again.");
        }
        throw new Error(ERROR_MESSAGES.INVALID_TOKEN);
      }
      req.user = { id: verification.decoded._id };
      return true;
    }),
  title: body(ENTITY_PATH.TITLE)
    .notEmpty()
    .withMessage(ERROR_MESSAGES.EMPTY_TITLE),
  isCompleted: body(ENTITY_PATH.IS_COMPLETED)
    .exists()
    .withMessage(ERROR_MESSAGES.IS_COMPLETED_REQUIRED)
    .isBoolean()
    .withMessage(ERROR_MESSAGES.INVALID_IS_COMPLETED)
    .toBoolean(),
  todoId: param(ENTITY_PATH.ID)
    .isMongoId()
    .withMessage(ERROR_MESSAGES.INVALID_ID),
};

module.exports = {
  getTodos: [todoRequirements.token],
  createTodo: [
    todoRequirements.token,
    todoRequirements.title,
    checkExact([], {
      message: "Only title field is allowed.",
    }),
  ],
  updateTodoTitle: [
    todoRequirements.token,
    todoRequirements.title,
    todoRequirements.todoId,
    checkExact([], {
      message: "Only title field is allowed.",
    }),
  ],
  updateTodoCompleted: [
    todoRequirements.token,
    todoRequirements.isCompleted,
    todoRequirements.todoId,
    checkExact([], {
      message: "Only isCompleted field is allowed.",
    }),
  ],
  deleteTodo: [todoRequirements.token, todoRequirements.todoId],
};
