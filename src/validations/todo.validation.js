const { header, query, param, body, checkExact } = require("express-validator");

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
    .withMessage("Invalid JWT token."),
  queryUserId: query("userId").isUUID().withMessage("Invalid userId param."),
  title: body("title").notEmpty().withMessage("Title cannot be empty."),
  isCompleted: body("isCompleted")
    .exists()
    .withMessage("Field isCompleted is required.")
    .isBoolean()
    .withMessage("Invalid isCompleted field value.")
    .toBoolean(),
  bodyUserId: body("userId").isUUID().withMessage("Invalid userId param."),
  todoId: param("id").isUUID().withMessage("Invalid ID param."),
};

module.exports = {
  getTodos: [todoRequirements.token, todoRequirements.queryUserId],
  createTodo: [
    todoRequirements.token,
    todoRequirements.title,
    todoRequirements.bodyUserId,
    checkExact([], {
      message: "Only title and userId fields are allowed.",
    }),
  ],
  updateTodoTitle: [
    todoRequirements.token,
    todoRequirements.title,
    todoRequirements.bodyUserId,
    todoRequirements.todoId,
    checkExact([], {
      message: "Only title and userId fields are allowed.",
    }),
  ],
  updateTodoCompleted: [
    todoRequirements.token,
    todoRequirements.isCompleted,
    todoRequirements.bodyUserId,
    todoRequirements.todoId,
    checkExact([], {
      message: "Only isCompleted and userId fields are allowed.",
    }),
  ],
  deleteTodo: [
    todoRequirements.token,
    todoRequirements.queryUserId,
    todoRequirements.todoId,
  ],
};
