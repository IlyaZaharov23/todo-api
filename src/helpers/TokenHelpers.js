const jwt = require("jsonwebtoken");

class TokenHelpers {
  static createToken(user) {
    const secretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(user, secretKey, { expiresIn: "1h" });
    return token;
  }
  static checkToken(token) {
    const secretKey = process.env.JWT_SECRET_KEY;
    try {
      const decoded = jwt.verify(token, secretKey);
      return { isValid: true, decoded };
    } catch (error) {
      return { isValid: false, error: error.message };
    }
  }
}

module.exports = TokenHelpers;
