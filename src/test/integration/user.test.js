const { expect } = require("chai");
const supertest = require("supertest");
const app = require("../../index");
const {
  getReqError,
  expectError,
  expectSuccess,
  validateUserStructure,
} = require("../helpers");
const {
  API_ENDPOINTS,
  generateUniqueUser,
} = require("../fixtures/user.fixtures");
const {
  ENTITY_PATH,
  ERRORS_LOCATION,
  ERROR_MESSAGES,
} = require("../../constants/errors.template");

const request = supertest(app);

describe("POST /register", () => {
  it("Should return new user", async () => {
    const newUser = generateUniqueUser();
    const response = await request.post(API_ENDPOINTS.REGISTER).send(newUser);

    expectSuccess(response, 201);
    validateUserStructure(response.body);
  });

  it("Should return error user already exists", async () => {
    const existingUser = generateUniqueUser();

    await request.post(API_ENDPOINTS.REGISTER).send(existingUser);
    const response = await request
      .post(API_ENDPOINTS.REGISTER)
      .send(existingUser);

    expectError(response, 400, [
      getReqError(
        ENTITY_PATH.EMAIL,
        ERRORS_LOCATION.BODY,
        ERROR_MESSAGES.USER_EXISTS,
        existingUser.email
      ),
    ]);
  });
});

describe("POST /login", () => {
  it("Should return token and user id", async () => {
    const newUser = generateUniqueUser();
    await request.post(API_ENDPOINTS.REGISTER).send(newUser);

    const response = await request.post(API_ENDPOINTS.LOGIN).send(newUser);

    expectSuccess(response, 200);
    expect(response.body).to.have.property(ENTITY_PATH.USER_ID);
    expect(response.body).to.have.property(ENTITY_PATH.TOKEN);
  });

  it("Should return user not found", async () => {
    const newUser = generateUniqueUser();
    const response = await request.post(API_ENDPOINTS.LOGIN).send(newUser);

    expectError(response, 400, [
      getReqError(
        ENTITY_PATH.EMAIL,
        ERRORS_LOCATION.BODY,
        ERROR_MESSAGES.INVALID_LOGIN,
        newUser.email
      ),
      getReqError(
        ENTITY_PATH.PASSWORD,
        ERRORS_LOCATION.BODY,
        ERROR_MESSAGES.INVALID_LOGIN,
        newUser.password
      ),
    ]);
  });
});
