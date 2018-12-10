const initServer = require('../server/initServer');
const initRoutes = require('../files/routes');

require('dotenv').config();

const start = async () => {
    try {
        const server = await initServer();
        await initRoutes(server);
        await server.start();
        console.log('server started at', server.info.uri);
        return server; 
    } catch (err) {
        console.log('CANT LAUNCH SERVER', err);
        process.exit(1);
    }
}

module.exports = start