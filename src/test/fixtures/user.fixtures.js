const API_ENDPOINTS = {
  REGISTER: "/api/register",
  LOGIN: "/api/login",
  TODOS: "/api/todos",
};

const TEST_USER = {
  email: "testuser@outlook.com",
  password: "Example123!",
};

const generateUniqueUser = () => ({
  email: `test_${Date.now()}@outlook.com`,
  password: "Example123!",
});

module.exports = {
  API_ENDPOINTS,
  TEST_USER,
  generateUniqueUser,
};
