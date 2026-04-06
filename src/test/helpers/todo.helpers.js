const supertest = require("supertest");
const app = require("../../index");
const { API_ENDPOINTS } = require("../fixtures/todo.fixtures");
const { setupTestUser } = require("./auth.helpers");
const request = supertest(app);

const createTodo = async (authToken, userId, title = "First todo") => {
  const { body } = await request
    .post(API_ENDPOINTS.TODOS)
    .send({ title, userId })
    .set("Authorization", authToken);

  return body;
};

const setupTestWithTodo = async (userData, title = "First todo") => {
  const { authToken, userId } = await setupTestUser(userData);
  const todo = await createTodo(authToken, userId, title);

  return {
    authToken,
    userId,
    todoId: todo.id,
  };
};

module.exports = {
  createTodo,
  setupTestWithTodo,
};
