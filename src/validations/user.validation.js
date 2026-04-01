const { body, checkExact } = require("express-validator");
const ValidationHelpers = require("../helpers/ValidationHelpers");

const userRequirements = {
  email: body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Email is not valid.")
    .trim(),
  regEmail: body("email").custom(async (value, { req }) => {
    const userValidationHelpers = new ValidationHelpers();
    const { email } = req.body;
    await userValidationHelpers.isUserExist(email);
    return true;
  }),
  password: body("password")
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
