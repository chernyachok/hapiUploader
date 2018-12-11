const initServer = require('../server/initServer');
const initRoutes = require('../files/routes');
const workingUrl = require('../utils/workingUrl');

require('dotenv').config();
console.log('CURRENT PORT', process.env.PORT, workingUrl);
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