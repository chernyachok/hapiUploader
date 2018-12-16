const Hapi = require('hapi');
const inert = require('inert');
const { boomPlugin } = require('../plugins/boom')

const initServer = async (serverConfigs) => {
    const {port, host} = serverConfigs;
    const server = Hapi.server({
        port,
        host,
        // router: {
        //     stripTrailingSlash: true
        // }
        routes: {
            files: {
                relativeTo : (process.cwd() + '/public')
            }
        }
    });
    
    await server.register([{
        plugin: inert
    },{
        plugin: boomPlugin
    }]);

    return server;
}

module.exports = initServer;