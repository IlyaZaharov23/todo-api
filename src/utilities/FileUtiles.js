const fsPromises = require("fs/promises");

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
    return parsedData[userId] || [];
  }
  async updateUserTodos(userId, todos) {
    const parsedData = await this.getDataFromDB();
    parsedData[userId] = todos;
    await fsPromises.writeFile(this.#DB_URL, JSON.stringify(parsedData));
  }
}

module.exports = FileUtiles;
