const initServer = require('./initServer');
const initRoutes = require('../files/routes');
const initConnection = require('../db/connection');
const File = require('../db/models/file');
const FileController = require('../files/controller');

const start = async () => {
    try {
        const server = await initServer();
        const connection = await initConnection();
        const fileModel = File(connection);
        const fileController = new FileController(fileModel);
        await initRoutes(server, fileController);
        await server.start();
        console.log(`server start at ${server.info.uri}`);
        console.log('Connection to the database has been established successfully.');
    } catch (err) {
        console.log('cant launch the server or database', err);
        process.exit(1);
    }
}

module.exports = start;