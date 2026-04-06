const { expect } = require("chai");
const { ENTITY_PATH } = require("../../constants/errors.template");

const expectError = (response, expectedStatus, expectedErrors) => {
  expect(response.status).to.equal(expectedStatus);
  expect(response.body).to.deep.equal(expectedErrors);
};

const expectSuccess = (response, expectedStatus) => {
  expect(response.status).to.equal(expectedStatus);
};

const validateTodoStructure = (todo) => {
  expect(todo).to.have.property(ENTITY_PATH.ID);
  expect(todo).to.have.property(ENTITY_PATH.IS_COMPLETED);
  expect(todo).to.have.property(ENTITY_PATH.TITLE);
  expect(todo).to.have.property(ENTITY_PATH.ID_USER);
};

const validateUserStructure = (user) => {
  expect(user).to.have.property(ENTITY_PATH.ID);
  expect(user).to.have.property(ENTITY_PATH.EMAIL);
};

module.exports = {
  expectError,
  expectSuccess,
  validateTodoStructure,
  validateUserStructure,
};
