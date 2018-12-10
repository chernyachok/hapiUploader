const Hapi = require('hapi');
const inert = require('inert');

const initServer = async () => {

    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
        // router: {
        //     stripTrailingSlash: true
        // }
        routes: {
            files: {
                relativeTo : (process.cwd() + '/public')
            }
        }
    });
    
    await server.register({
        plugin: inert
    });
    return server;
}

module.exports = initServer;