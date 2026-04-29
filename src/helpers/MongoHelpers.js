const MongoClient = require('mongodb').MongoClient

class MongoHelpers {
    static async getConnection() {
        return MongoClient.connect(process.env.MONGO_DB_URI)
    }

    static useDefaultDb(connection) {
        return connection.db(process.env.MONGO_DB_NAME)
    }
}

module.exports = MongoHelpers