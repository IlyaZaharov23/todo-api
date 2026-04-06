const ERROR_MESSAGES = {
  INVALID_TOKEN: "Invalid token. Authentication failed.",
  INVALID_USER_ID: "Invalid userId param.",
  INVALID_ID: "Invalid ID param.",
  EMPTY_TITLE: "Title cannot be empty.",
  TODO_NOT_FOUND: "Todo not found.",
  IS_COMPLETED_REQUIRED: "Field isCompleted is required.",
  INVALID_IS_COMPLETED: "Invalid isCompleted field value.",
  INVALID_LOGIN: "Invalid email or password.",
  USER_EXISTS: "User already exists.",
};

const ERRORS_LOCATION = {
  BODY: "body",
  PARAMS: "params",
  QUERY: "query",
  HEADERS: "headers",
};

const ENTITY_PATH = {
  AUTHORIZATION: "authorization",
  USER_ID: "userId",
  PASSWORD: "password",
  EMAIL: "email",
  TITLE: "title",
  ID: "id",
  IS_COMPLETED: "isCompleted",
  ID_USER: "idUser",
  TOKEN: "token",
};

const ERRORS_TYPE = {
  FIELD: "field",
};

module.exports = {
  ERRORS_LOCATION,
  ENTITY_PATH,
  ERRORS_TYPE,
  ERROR_MESSAGES,
};
