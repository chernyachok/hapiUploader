const initServer = require('./initServer');
const initApi = require('../files');

const start = async (serverConfigs) => {
    try {
        const server = await initServer(serverConfigs);
        await initApi(server, serverConfigs.pathToImgs);
        await server.start();
        console.log(`server start at ${server.info.uri}`);
        console.log('Connection to the database has been established successfully.');
    } catch (err) {
        console.log('cant launch the server or database', err);
        process.exit(1);
    }
}

module.exports = start;