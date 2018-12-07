const Hapi = require('hapi');
const inert = require('inert');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config()
const initServer = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
        routes: {
            files: {
                relativeTo: path.join(__dirname, '..', 'public')
            }
        }
    });
    
    await server.register({
        plugin: inert,
        options: {

        }
    });
    return server;
}

module.exports = initServer;