const initServer = require('./initServer');
const initApi = require('../files');
const initDb = require('../db/initDb');

const start = async (serverConfigs) => {
    try {
        const server = await initServer(serverConfigs);
        const connection = await initDb(serverConfigs);
        await initApi(server, connection);
        await server.start();
        console.log(`server start at ${server.info.uri}`);
        console.log('Connection to the database has been established successfully.');
    } catch (err) {
        console.log('cant launch the server or database', err);
        process.exit(1);
    }
}

module.exports = start;