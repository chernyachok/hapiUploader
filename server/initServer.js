const Hapi = require('hapi');
const inert = require('inert');
const path = require('path');

const initServer = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
        // router: {
        //     stripTrailingSlash: true
        // }
    });
    
    await server.register({
        plugin: inert,
        options: {

        }
    });
    return server;
}

module.exports = initServer;