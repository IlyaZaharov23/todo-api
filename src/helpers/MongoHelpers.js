const MongoClient = require("mongodb").MongoClient;

class MongoHelpers {
  static async getConnection() {
    return MongoClient.connect(process.env.MONGO_DB_URI);
  }

  static useDefaultDb(connection) {
    return connection.db(process.env.MONGO_DB_NAME);
  }

  static async collectionDbProcess(collectionName, callback) {
    const connection = await this.getConnection();
    try {
      const db = this.useDefaultDb(connection);
      const collection = db.collection(collectionName);
      return await callback(collection);
    } catch (error) {
      throw error;
    } finally {
      await connection.close();
    }
  }
}

module.exports = MongoHelpers;
