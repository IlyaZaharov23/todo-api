const ERRORS_TEMPLATE = {
  TODO_NOT_FOUND: "Todo not found.",
  AUTH_ERROR: "Invalid email or password.",
  USER_EXIST: "User already exists.",
};

const ERRORS_LOCATION = {
  BODY: "body",
  PARAMS: "params",
  QUERY: "query",
  HEADERS: "headers",
};

const ERRORS_PATH = {
  PASSWORD: "password",
  EMAIL: "email",
  TITLE: "title",
  IS_COMPLETED: "isCompleted",
};

const ERRORS_TYPE = {
  FIELD: "field",
};

module.exports = {
  ERRORS_TEMPLATE,
  ERRORS_LOCATION,
  ERRORS_PATH,
  ERRORS_TYPE,
};
