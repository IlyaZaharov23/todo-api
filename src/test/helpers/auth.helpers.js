const jwt = require("jsonwebtoken");
const supertest = require("supertest");
const { API_ENDPOINTS } = require("../fixtures/user.fixtures");
const app = require("../../index");

const request = supertest(app);

const setupTestUser = async (userData) => {
  await request.post(API_ENDPOINTS.REGISTER).send(userData);
  const { body } = await request.post(API_ENDPOINTS.LOGIN).send(userData);

  return {
    authToken: `Bearer ${body.token}`,
    userId: body.userId,
  };
};

const generateInvalidToken = (
  payload = "username",
  secret = "wrong_secret"
) => {
  return jwt.sign(payload, secret);
};

module.exports = {
  setupTestUser,
  generateInvalidToken,
};
