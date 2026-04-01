const bcrypt = require("bcrypt");
class CryptHelpers {
  static async hashPassword(password) {
    const saltRounds = process.env.HASH_SALT;
    const hashedPassword = await bcrypt.hash(password, Number(saltRounds));
    return hashedPassword;
  }
  static async checkPassword(password, userPassword) {
    const isPasswordValid = await bcrypt.compare(password, userPassword);
    return isPasswordValid;
  }
}

module.exports = CryptHelpers;
