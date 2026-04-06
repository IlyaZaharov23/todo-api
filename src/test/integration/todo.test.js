const { expect } = require("chai");
const { v4: uuid } = require("uuid");
const supertest = require("supertest");
const app = require("../../index");
const {
  getReqError,
  setupTestUser,
  setupTestWithTodo,
  expectError,
  expectSuccess,
  validateTodoStructure,
  generateInvalidToken,
} = require("../helpers");
const { API_ENDPOINTS, TEST_USER } = require("../fixtures/user.fixtures");
const { TODO_DATA } = require("../fixtures/todo.fixtures");
const {
  ERRORS_LOCATION,
  ENTITY_PATH,
  ERROR_MESSAGES,
} = require("../../constants/errors.template");
const AUTHORIZATION_FIELD = require("../fixtures/headerField.fixture");

const request = supertest(app);

describe("GET /todos", () => {
  let authToken;
  let userId;

  before(async () => {
    const setup = await setupTestUser(TEST_USER);
    authToken = setup.authToken;
    userId = setup.userId;
  });

  it("Should get user tasks", async () => {
    const response = await request
      .get(API_ENDPOINTS.TODOS)
      .query({ userId })
      .set(AUTHORIZATION_FIELD, authToken);

    expectSuccess(response, 200);
    expect(Array.isArray(response.body)).to.be.true;
  });

  it("Should return token error", async () => {
    const invalidToken = generateInvalidToken();
    const response = await request
      .get(API_ENDPOINTS.TODOS)
      .query({ userId })
      .set(AUTHORIZATION_FIELD, `Bearer ${invalidToken}`);

    expectError(response, 401, [
      getReqError(
        ENTITY_PATH.AUTHORIZATION,
        ERRORS_LOCATION.HEADERS,
        ERROR_MESSAGES.INVALID_TOKEN,
        invalidToken
      ),
    ]);
  });

  it("Should return userId error", async () => {
    const response = await request
      .get(API_ENDPOINTS.TODOS)
      .query({ userId: TODO_DATA.INVALID_USER_ID })
      .set(AUTHORIZATION_FIELD, authToken);

    expectError(response, 400, [
      getReqError(
        ENTITY_PATH.USER_ID,
        ERRORS_LOCATION.QUERY,
        ERROR_MESSAGES.INVALID_USER_ID,
        TODO_DATA.INVALID_USER_ID
      ),
    ]);
  });
});

describe("POST /todos", () => {
  let authToken;
  let userId;

  before(async () => {
    const setup = await setupTestUser(TEST_USER);
    authToken = setup.authToken;
    userId = setup.userId;
  });

  it("Should create todo and return it", async () => {
    const todo = {
      title: TODO_DATA.VALID_TITLE,
      userId,
    };

    const response = await request
      .post(API_ENDPOINTS.TODOS)
      .send(todo)
      .set(AUTHORIZATION_FIELD, authToken);

    expectSuccess(response, 201);
    validateTodoStructure(response.body);
  });

  it("Should return title error if invalid title", async () => {
    const todo = {
      title: TODO_DATA.EMPTY_TITLE,
      userId,
    };

    const response = await request
      .post(API_ENDPOINTS.TODOS)
      .send(todo)
      .set(AUTHORIZATION_FIELD, authToken);

    expectError(response, 400, [
      getReqError(
        ENTITY_PATH.TITLE,
        ERRORS_LOCATION.BODY,
        ERROR_MESSAGES.EMPTY_TITLE,
        todo.title
      ),
    ]);
  });
});

describe("PATCH /todos/:id", () => {
  let authToken;
  let userId;
  let todoId;

  before(async () => {
    const setup = await setupTestWithTodo(TEST_USER);
    authToken = setup.authToken;
    userId = setup.userId;
    todoId = setup.todoId;
  });

  it("Should change todo title and return todo", async () => {
    const data = {
      title: TODO_DATA.UPDATED_TITLE,
      userId,
    };

    const response = await request
      .patch(`${API_ENDPOINTS.TODOS}/${todoId}`)
      .send(data)
      .set(AUTHORIZATION_FIELD, authToken);

    expectSuccess(response, 200);
    validateTodoStructure(response.body);
  });

  it("Should return not found error if todo doesn't exist", async () => {
    const nonExistentId = uuid();
    const data = {
      title: TODO_DATA.UPDATED_TITLE,
      userId,
    };

    const response = await request
      .patch(`${API_ENDPOINTS.TODOS}/${nonExistentId}`)
      .send(data)
      .set(AUTHORIZATION_FIELD, authToken);

    expectError(response, 404, [
      getReqError(
        ENTITY_PATH.TITLE,
        ERRORS_LOCATION.BODY,
        ERROR_MESSAGES.TODO_NOT_FOUND,
        data.title
      ),
    ]);
  });
});

describe("DELETE /todos/:id", () => {
  let authToken;
  let userId;
  let todoId;

  before(async () => {
    const setup = await setupTestWithTodo(TEST_USER);
    authToken = setup.authToken;
    userId = setup.userId;
    todoId = setup.todoId;
  });

  it("Should return deleted todo id", async () => {
    const response = await request
      .delete(`${API_ENDPOINTS.TODOS}/${todoId}`)
      .query({ userId })
      .set(AUTHORIZATION_FIELD, authToken);

    expectSuccess(response, 200);
    expect(response.body.id).to.equal(todoId);
  });

  it("Should return todo id error if request has invalid todo id", async () => {
    const invalidTodoId = todoId + "1";
    const response = await request
      .delete(`${API_ENDPOINTS.TODOS}/${invalidTodoId}`)
      .query({ userId })
      .set(AUTHORIZATION_FIELD, authToken);

    expectError(response, 400, [
      getReqError(
        ENTITY_PATH.ID,
        ERRORS_LOCATION.PARAMS,
        ERROR_MESSAGES.INVALID_ID,
        invalidTodoId
      ),
    ]);
  });
});

describe("PATCH /todos/:id/isCompleted", () => {
  let authToken;
  let userId;
  let todoId;

  before(async () => {
    const setup = await setupTestWithTodo(TEST_USER);
    authToken = setup.authToken;
    userId = setup.userId;
    todoId = setup.todoId;
  });

  it("Should change todo completed and return todo", async () => {
    const data = {
      isCompleted: true,
      userId,
    };

    const response = await request
      .patch(`${API_ENDPOINTS.TODOS}/${todoId}/isCompleted`)
      .send(data)
      .set("Authorization", authToken);

    expectSuccess(response, 200);
    validateTodoStructure(response.body);
  });

  it("Should return validation errors if todo doesn't exist", async () => {
    const nonExistentId = uuid();
    const data = { userId };

    const response = await request
      .patch(`${API_ENDPOINTS.TODOS}/${nonExistentId}/isCompleted`)
      .send(data)
      .set("Authorization", authToken);

    expectError(response, 400, [
      getReqError(
        ENTITY_PATH.IS_COMPLETED,
        ERRORS_LOCATION.BODY,
        ERROR_MESSAGES.IS_COMPLETED_REQUIRED
      ),
      getReqError(
        ENTITY_PATH.IS_COMPLETED,
        ERRORS_LOCATION.BODY,
        ERROR_MESSAGES.INVALID_IS_COMPLETED
      ),
    ]);
  });
});
