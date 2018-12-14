const initServer = require('./initServer');
const initRoutes = require('../files/routes');
const initConnection = require('../db/initDb');

const start = async () => {
    try {
        const server = await initServer();
        const connection = await initConnection();
        await initRoutes(server, connection);
        await server.start();
        console.log(`server start at ${server.info.uri}`);
        console.log('Connection to the database has been established successfully.');
    } catch (err) {
        console.log('cant launch the server or database', err);
        process.exit(1);
    }
}

module.exports = start;