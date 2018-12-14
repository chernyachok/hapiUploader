const Sequalize = require('sequelize');
const { dbName, dbUser, dbUserPass, dbDialect } = require('../configurations').getServerConfigs();

const initDb = async () => {
        const connection = new Sequalize(dbName, dbUser, dbUserPass, {
            dialect: dbDialect
        });   
        await connection.authenticate();
        return connection;
}

module.exports = initDb;