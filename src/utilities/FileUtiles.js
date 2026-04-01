const fsPromises = require("fs/promises");
const ENTITIES = require("../constants/entities");

class FileUtiles {
  #DB_URL = "db.json";
  async getDataFromDB() {
    try {
      const dbData = await fsPromises.readFile(this.#DB_URL, "utf-8");
      return JSON.parse(dbData);
    } catch (error) {
      return {};
    }
  }
  async getUserTodos(userId) {
    const parsedData = await this.getDataFromDB();
    return parsedData[ENTITIES.TODOS][userId] || [];
  }
  async updateUserTodos(userId, todos) {
    const parsedData = await this.getDataFromDB();
    parsedData[ENTITIES.TODOS][userId] = todos;
    await fsPromises.writeFile(this.#DB_URL, JSON.stringify(parsedData));
  }
  async getUsers() {
    const parsedData = await this.getDataFromDB();
    return parsedData[ENTITIES.USERS] || [];
  }
  async updateUsers(newUsers) {
    const parsedData = await this.getDataFromDB();
    parsedData[ENTITIES.USERS] = newUsers;
    await fsPromises.writeFile(this.#DB_URL, JSON.stringify(parsedData));
  }
}

module.exports = FileUtiles;
