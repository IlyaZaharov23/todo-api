const { body, checkExact } = require("express-validator");
const ValidationHelpers = require("../helpers/ValidationHelpers");
const { ENTITY_PATH } = require("../constants/errors.template");

const userRequirements = {
  email: body(ENTITY_PATH.EMAIL)
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Email is not valid.")
    .trim(),
  regEmail: body("email").custom(async (value) => {
    const userValidationHelpers = new ValidationHelpers();
    await userValidationHelpers.isUserExist(value);
    return true;
  }),
  password: body(ENTITY_PATH.PASSWORD)
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 symbols.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/\d/)
    .withMessage("Password must contain at least one number.")
    .not()
    .matches(/^\s+|\s+$/)
    .withMessage("Password should not contain leading or trailing spaces.")
    .trim(),
};

module.exports = {
  createUser: [
    userRequirements.email,
    userRequirements.regEmail,
    userRequirements.password,
    checkExact([], {
      message: "Only email and password fields are allowed.",
    }),
  ],
  authUser: [
    userRequirements.email,
    userRequirements.password,
    checkExact([], {
      message: "Only email and password fields are allowed.",
    }),
  ],
};
