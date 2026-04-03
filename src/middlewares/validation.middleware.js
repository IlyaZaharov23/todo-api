const { validationResult } = require("express-validator");

class ValidationMiddleware {
  static async chechValidation(req, res, next) {
    const errors = validationResult(req);
    const hasAuthorizationError = errors
      .array()
      .find((error) => error.path === "authorization");
    const statusCode = hasAuthorizationError ? 401 : 400;
    if (!errors.isEmpty()) {
      return res.status(statusCode).send(errors.array());
    }
    next();
  }
}

module.exports = ValidationMiddleware;
