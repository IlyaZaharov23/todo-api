class ValidationError extends Error {
  constructor(errors, statusCode) {
    super("Validation Error");
    this.name = "ValidationError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

module.exports = ValidationError;
