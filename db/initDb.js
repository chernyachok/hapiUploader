const Sequalize = require('sequelize');

const initDb = async (serverConfigs) => {
    const { dbName, dbUser, dbUserPass, dbDialect } = serverConfigs;
        const connection = new Sequalize(dbName, dbUser, dbUserPass, {
            dialect: dbDialect,
            define: {
                freezeTableName: true,
                timestamps: false
            },
            logging: false
        });   
        await connection.authenticate();
        return connection;
}

module.exports = initDb;