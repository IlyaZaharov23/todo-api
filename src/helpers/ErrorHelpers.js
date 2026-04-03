class ErrorHelpers {
  static catchError(res, error, statusCode) {
    if (error.errors?.length) {
      return res.status(statusCode).send(error.errors);
    }
    res.status(500).send(error.message);
  }
}

module.exports = ErrorHelpers;
