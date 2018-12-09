const initServer = require('./initServer');
const initRoutes = require('../files/routes');

const start = async () => {
    try {
        const server = await initServer();
        await initRoutes(server);
        await server.start();
        console.log(`server start at ${server.info.uri}`);
    } catch (err) {
        console.log('cant launch the server', err.message);
        process.exit(1);
    }
}

module.exports = start;