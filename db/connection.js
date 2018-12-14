const Sequalize = require('sequelize');

const initConnection = async () => {
        const connection = new Sequalize('hapi_uploader', 'root', '123', {
            dialect: 'mysql'
        });        
        await connection.authenticate();
        return connection;
}

module.exports = initConnection;