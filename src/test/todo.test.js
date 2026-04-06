const { expect } = require("chai");
const supertest = require("supertest");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
const app = require("..");
const request = supertest(app);

const testUser = {
  email: "testuser@outlook.com",
  password: "Example123!",
};

const getReqError = (path, location, msg, value) => {
  return typeof value === "string"
    ? {
        type: "field",
        value: value,
        msg: msg,
        path: path,
        location: location,
      }
    : {
        type: "field",
        msg: msg,
        path: path,
        location: location,
      };
};

describe("GET /todos", () => {
  let authToken = "Bearer ";
  let userId;

  before(async () => {
    await request.post("/api/register").send(testUser);

    const loginResponse = await request.post("/api/login").send(testUser);

    authToken += loginResponse.body.token;
    userId = loginResponse.body.userId;
  });

  it("Should get user tasks.", async () => {
    const response = await request
      .get("/api/todos")
      .query({ userId })
      .set("Authorization", authToken);
    expect(response.status).to.equal(200);
    expect(Array.isArray(response.body)).to.be.true;
  });

  it("Should return token error.", async () => {
    const token = jwt.sign("username", "some_secret_key");

    const response = await request
      .get("/api/todos")
      .query({ userId })
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal([
      getReqError(
        "authorization",
        "headers",
        "Invalid token. Authentication failed.",
        token
      ),
    ]);
  });

  it("Should return userId error.", async () => {
    const wrongUserId = "123";

    const response = await request
      .get("/api/todos")
      .query({ userId: wrongUserId })
      .set("Authorization", authToken);

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal([
      getReqError("userId", "query", "Invalid userId param.", wrongUserId),
    ]);
  });
});

describe("POST /todos", () => {
  let authToken = "Bearer ";
  let userId;

  before(async () => {
    await request.post("/api/register").send(testUser);

    const loginResponse = await request.post("/api/login").send(testUser);

    authToken += loginResponse.body.token;
    userId = loginResponse.body.userId;
  });

  it("Should create todo and return it.", async () => {
    const todo = {
      title: "First todo",
      userId,
    };
    const response = await request
      .post("/api/todos")
      .send(todo)
      .set("Authorization", authToken);
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("id");
    expect(response.body).to.have.property("isCompleted");
    expect(response.body).to.have.property("title");
    expect(response.body).to.have.property("idUser");
  });
  it("Should return title error if invalid title.", async () => {
    const todo = {
      title: "",
      userId,
    };
    const response = await request
      .post("/api/todos")
      .send(todo)
      .set("Authorization", authToken);
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal([
      getReqError("title", "body", "Title cannot be empty.", todo.title),
    ]);
  });
  it("Should return userId error if invalid userId.", async () => {
    const todo = {
      title: "First todo",
      userId: "",
    };
    const response = await request
      .post("/api/todos")
      .send(todo)
      .set("Authorization", authToken);
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal([
      getReqError("userId", "body", "Invalid userId param.", todo.userId),
    ]);
  });
});

describe("PATCH /todos/:id", () => {
  let authToken = "Bearer ";
  let userId;
  let todoId;

  before(async () => {
    await request.post("/api/register").send(testUser);

    const loginResponse = await request.post("/api/login").send(testUser);

    authToken += loginResponse.body.token;
    userId = loginResponse.body.userId;

    const data = {
      title: "First todo",
      userId,
    };

    const { body } = await request
      .post("/api/todos")
      .send(data)
      .set("Authorization", authToken);

    todoId = body.id;
  });

  it("Should change todo title and return todo.", async () => {
    const data = {
      title: "Change",
      userId,
    };
    const { status, body } = await request
      .patch(`/api/todos/${todoId}`)
      .send(data)
      .set("Authorization", authToken);
    expect(status).to.equal(200);
    expect(body).to.have.property("id");
    expect(body).to.have.property("isCompleted");
    expect(body).to.have.property("title");
    expect(body).to.have.property("idUser");
  });

  it("Should return not found error if todo doesn't exist.", async () => {
    const todoId = uuid();
    const data = {
      title: "Change",
      userId,
    };
    const { body, status } = await request
      .patch(`/api/todos/${todoId}`)
      .send(data)
      .set("Authorization", authToken);
    expect(status).to.equal(404);
    expect(body).to.deep.equal([
      getReqError("title", "body", "Todo not found.", data.title),
    ]);
  });
});

describe("DELETE /todos/:id", () => {
  let authToken = "Bearer ";
  let userId;
  let todoId;

  before(async () => {
    await request.post("/api/register").send(testUser);

    const loginResponse = await request.post("/api/login").send(testUser);

    authToken += loginResponse.body.token;
    userId = loginResponse.body.userId;

    const data = {
      title: "First todo",
      userId,
    };

    const { body } = await request
      .post("/api/todos")
      .send(data)
      .set("Authorization", authToken);

    todoId = body.id;
  });

  it("Should return deleted todo id.", async () => {
    const { body, status } = await request
      .delete(`/api/todos/${todoId}`)
      .query({ userId })
      .set("Authorization", authToken);

    expect(status).to.equal(200);
    expect(body.id).to.equal(todoId);
  });

  it("Should return todo id error if request has invalid todo id.", async () => {
    const changedTodoId = todoId + "1";
    const { body, status } = await request
      .delete(`/api/todos/${changedTodoId}`)
      .query({ userId })
      .set("Authorization", authToken);
    expect(status).to.equal(400);
    expect(body).to.deep.equal([
      getReqError("id", "params", "Invalid ID param.", changedTodoId),
    ]);
  });
});

describe("PATCH /todos/:id/isCompleted", () => {
  let authToken = "Bearer ";
  let userId;
  let todoId;

  before(async () => {
    await request.post("/api/register").send(testUser);

    const loginResponse = await request.post("/api/login").send(testUser);

    authToken += loginResponse.body.token;
    userId = loginResponse.body.userId;

    const data = {
      title: "First todo",
      userId,
    };

    const { body } = await request
      .post("/api/todos")
      .send(data)
      .set("Authorization", authToken);

    todoId = body.id;
  });
  it("Should change todo completed and return todo.", async () => {
    const data = {
      isCompleted: true,
      userId,
    };
    const { status, body } = await request
      .patch(`/api/todos/${todoId}/isCompleted`)
      .send(data)
      .set("Authorization", authToken);

    expect(status).to.equal(200);
    expect(body).to.have.property("id");
    expect(body).to.have.property("isCompleted");
    expect(body).to.have.property("title");
    expect(body).to.have.property("idUser");
  });

  it("Should return not found error if todo doesn't exist.", async () => {
    const todoId = uuid();
    const data = {
      userId,
    };
    const { body, status } = await request
      .patch(`/api/todos/${todoId}/isCompleted`)
      .send(data)
      .set("Authorization", authToken);
    expect(status).to.equal(400);
    expect(body).to.deep.equal([
      getReqError("isCompleted", "body", "Field isCompleted is required."),
      getReqError("isCompleted", "body", "Invalid isCompleted field value."),
    ]);
  });
});
