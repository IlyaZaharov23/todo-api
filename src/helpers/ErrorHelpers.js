const Sentry = require("@sentry/node");

class ErrorHelpers {
  static catchError(res, error, statusCode) {
    Sentry.captureException(error);
    if (error.errors?.length) {
      return res.status(statusCode).send(error.errors);
    }
    res.status(500).send(error.message);
  }
}

module.exports = ErrorHelpers;
